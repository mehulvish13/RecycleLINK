"""
Incentive Prediction Model
Uses XGBoost/TabNet to predict reward values based on user behavior and item characteristics.
"""

import pandas as pd
import numpy as np
from sklearn.preprocessing import LabelEncoder, StandardScaler
import xgboost as xgb
import joblib
import logging
from typing import Dict, List, Any

logger = logging.getLogger(__name__)

class IncentivePredictor:
    """ML model for predicting optimal incentive values."""
    
    def __init__(self, model_path=None):
        """Initialize the incentive predictor."""
        self.model = None
        self.label_encoders = {}
        self.scaler = StandardScaler()
        self.feature_names = [
            'weight', 'device_type_encoded', 'user_frequency', 
            'location_tier', 'season', 'weekday'
        ]
        
        # Device type value multipliers
        self.device_values = {
            'smartphone': 1.2,
            'laptop': 1.5,
            'desktop': 1.3,
            'tablet': 1.1,
            'television': 1.0,
            'refrigerator': 0.8,
            'washing_machine': 0.7,
            'microwave': 0.9,
            'printer': 1.0,
            'monitor': 1.1,
            'other': 0.8
        }
        
        # Location tiers (for India)
        self.location_tiers = {
            'tier1': ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad'],
            'tier2': ['Pune', 'Ahmedabad', 'Surat', 'Jaipur', 'Lucknow', 'Kanpur'],
            'tier3': []  # All other cities
        }
        
        if model_path:
            self.load_model(model_path)
        else:
            self._create_default_model()
    
    def _create_default_model(self):
        """Create a default XGBoost model with synthetic training data."""
        logger.info("Creating default incentive prediction model")
        
        # Generate synthetic training data
        np.random.seed(42)
        n_samples = 1000
        
        # Features
        weights = np.random.exponential(2.0, n_samples)  # Weight in kg
        device_types = np.random.choice(list(self.device_values.keys()), n_samples)
        user_frequencies = np.random.poisson(3, n_samples) + 1  # Pickup frequency
        cities = np.random.choice(['Mumbai', 'Delhi', 'Bangalore', 'Pune', 'Other'], n_samples)
        seasons = np.random.choice([0, 1, 2, 3], n_samples)  # 0-3 for quarters
        weekdays = np.random.choice([0, 1], n_samples)  # 0=weekend, 1=weekday
        
        # Create DataFrame
        data = pd.DataFrame({
            'weight': weights,
            'device_type': device_types,
            'user_frequency': user_frequencies,
            'city': cities,
            'season': seasons,
            'weekday': weekdays
        })
        
        # Feature engineering
        data['device_type_encoded'] = data['device_type'].map(self.device_values)
        data['location_tier'] = data['city'].apply(self._get_location_tier)
        
        # Generate target values (reward amounts in INR)
        base_reward = 50  # Base reward of 50 INR
        data['reward'] = (
            base_reward +
            data['weight'] * 20 +  # 20 INR per kg
            data['device_type_encoded'] * 30 +  # Device value multiplier
            data['user_frequency'] * 5 +  # Loyalty bonus
            data['location_tier'] * 10 +  # Location bonus
            np.random.normal(0, 10, n_samples)  # Noise
        ).clip(lower=20, upper=500)  # Clip to reasonable range
        
        # Prepare features
        X = data[['weight', 'device_type_encoded', 'user_frequency', 'location_tier', 'season', 'weekday']]
        y = data['reward']
        
        # Train model
        self.model = xgb.XGBRegressor(
            n_estimators=100,
            max_depth=6,
            learning_rate=0.1,
            random_state=42
        )
        
        self.model.fit(X, y)
        logger.info("Default incentive model trained successfully")
    
    def _get_location_tier(self, city):
        """Get location tier for a city."""
        if city in self.location_tiers['tier1']:
            return 3
        elif city in self.location_tiers['tier2']:
            return 2
        else:
            return 1
    
    def predict(self, weight: float, device_types: List[str], location: Dict[str, str], 
                user_frequency: int) -> Dict[str, Any]:
        """Predict incentive value for a pickup."""
        try:
            # Feature engineering
            avg_device_value = np.mean([self.device_values.get(dt, 0.8) for dt in device_types])
            location_tier = self._get_location_tier(location.get('city', 'Other'))
            
            # Current season (simplified - could use actual date)
            season = 0  # Default to Q1
            weekday = 1  # Default to weekday
            
            # Create feature vector
            features = np.array([[
                weight,
                avg_device_value,
                user_frequency,
                location_tier,
                season,
                weekday
            ]])
            
            # Predict
            if self.model:
                predicted_value = self.model.predict(features)[0]
            else:
                # Fallback calculation
                predicted_value = (
                    50 +  # Base reward
                    weight * 20 +  # Weight bonus
                    avg_device_value * 30 +  # Device value bonus
                    user_frequency * 5 +  # Loyalty bonus
                    location_tier * 10  # Location bonus
                )
            
            # Determine reward type
            if predicted_value >= 200:
                reward_type = 'cashback'
            elif predicted_value >= 100:
                reward_type = 'voucher'
            else:
                reward_type = 'points'
            
            # Calculate confidence (simplified)
            confidence = min(0.95, 0.7 + (user_frequency * 0.05))
            
            # Factors explanation
            factors = {
                'weight_contribution': weight * 20,
                'device_value_contribution': avg_device_value * 30,
                'loyalty_bonus': user_frequency * 5,
                'location_bonus': location_tier * 10,
                'base_reward': 50
            }
            
            return {
                'predicted_value': predicted_value,
                'reward_type': reward_type,
                'confidence': confidence,
                'factors': factors
            }
            
        except Exception as e:
            logger.error(f"Incentive prediction error: {e}")
            # Return default prediction
            return {
                'predicted_value': 100.0,
                'reward_type': 'points',
                'confidence': 0.5,
                'factors': {'base_reward': 100.0}
            }
    
    def save_model(self, path: str):
        """Save the trained model."""
        model_data = {
            'model': self.model,
            'label_encoders': self.label_encoders,
            'scaler': self.scaler,
            'feature_names': self.feature_names
        }
        joblib.dump(model_data, path)
        logger.info(f"Model saved to {path}")
    
    def load_model(self, path: str):
        """Load a trained model."""
        try:
            model_data = joblib.load(path)
            self.model = model_data['model']
            self.label_encoders = model_data['label_encoders']
            self.scaler = model_data['scaler']
            self.feature_names = model_data['feature_names']
            logger.info(f"Model loaded from {path}")
        except Exception as e:
            logger.error(f"Error loading model: {e}")
            self._create_default_model()

# Utility functions for model training and evaluation
def train_incentive_model(data_path: str, model_output_path: str):
    """Train incentive prediction model from CSV data."""
    # Load data
    data = pd.read_csv(data_path)
    
    # Feature engineering
    predictor = IncentivePredictor()
    
    # Prepare features and target
    features = ['weight', 'device_type_encoded', 'user_frequency', 'location_tier', 'season', 'weekday']
    X = data[features]
    y = data['reward']
    
    # Train model
    model = xgb.XGBRegressor(
        n_estimators=200,
        max_depth=8,
        learning_rate=0.05,
        random_state=42
    )
    
    model.fit(X, y)
    
    # Save model
    predictor.model = model
    predictor.save_model(model_output_path)
    
    return predictor

def evaluate_model(predictor: IncentivePredictor, test_data_path: str):
    """Evaluate the incentive prediction model."""
    from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
    
    # Load test data
    test_data = pd.read_csv(test_data_path)
    
    # Make predictions
    predictions = []
    for _, row in test_data.iterrows():
        result = predictor.predict(
            weight=row['weight'],
            device_types=[row['device_type']],
            location={'city': row['city']},
            user_frequency=row['user_frequency']
        )
        predictions.append(result['predicted_value'])
    
    # Calculate metrics
    y_true = test_data['reward']
    y_pred = predictions
    
    mae = mean_absolute_error(y_true, y_pred)
    mse = mean_squared_error(y_true, y_pred)
    r2 = r2_score(y_true, y_pred)
    
    return {
        'mae': mae,
        'mse': mse,
        'rmse': np.sqrt(mse),
        'r2': r2
    }
