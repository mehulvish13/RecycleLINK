#!/usr/bin/env python3
"""
RecycleLINK AI Model Server
Serves machine learning models for device classification, incentive prediction, and material value estimation.
"""

import os
import logging
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

# Import model modules
from models.device_classifier import DeviceClassifier
from models.incentive_predictor import IncentivePredictor
from models.material_estimator import MaterialEstimator
from utils.image_processor import ImageProcessor

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Initialize models globally
device_classifier = None
incentive_predictor = None
material_estimator = None
image_processor = None

def initialize_models():
    """Initialize all ML models."""
    global device_classifier, incentive_predictor, material_estimator, image_processor
    
    try:
        logger.info("Initializing AI models...")
        
        # Initialize image processor
        image_processor = ImageProcessor()
        
        # Initialize device classifier
        device_classifier = DeviceClassifier()
        
        # Initialize incentive predictor
        incentive_predictor = IncentivePredictor()
        
        # Initialize material estimator
        material_estimator = MaterialEstimator()
        
        logger.info("All models initialized successfully")
        
    except Exception as e:
        logger.error(f"Error initializing models: {e}")
        raise

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint."""
    return jsonify({
        'status': 'healthy',
        'models': {
            'device_classifier': device_classifier is not None,
            'incentive_predictor': incentive_predictor is not None,
            'material_estimator': material_estimator is not None
        }
    })

@app.route('/classify-device', methods=['POST'])
def classify_device():
    """Classify e-waste device from uploaded image."""
    try:
        if 'image' not in request.files:
            return jsonify({'error': 'No image file provided'}), 400
        
        image_file = request.files['image']
        if image_file.filename == '':
            return jsonify({'error': 'No image file selected'}), 400
        
        # Process image
        processed_image = image_processor.process_uploaded_image(image_file)
        
        # Classify device
        result = device_classifier.predict(processed_image)
        
        return jsonify({
            'success': True,
            'device_type': result['device_type'],
            'confidence': float(result['confidence']),
            'estimated_value': float(result['estimated_value']),
            'material_composition': result['material_composition'],
            'recycling_instructions': result['recycling_instructions']
        })
        
    except Exception as e:
        logger.error(f"Device classification error: {e}")
        return jsonify({'error': 'Classification failed'}), 500

@app.route('/predict-incentive', methods=['POST'])
def predict_incentive():
    """Predict incentive value based on user and item data."""
    try:
        data = request.get_json()
        
        required_fields = ['weight', 'device_types', 'location', 'user_frequency']
        if not all(field in data for field in required_fields):
            return jsonify({'error': 'Missing required fields'}), 400
        
        # Predict incentive
        result = incentive_predictor.predict(
            weight=data['weight'],
            device_types=data['device_types'],
            location=data['location'],
            user_frequency=data['user_frequency']
        )
        
        return jsonify({
            'success': True,
            'predicted_value': float(result['predicted_value']),
            'reward_type': result['reward_type'],
            'confidence': float(result['confidence']),
            'factors': result['factors']
        })
        
    except Exception as e:
        logger.error(f"Incentive prediction error: {e}")
        return jsonify({'error': 'Prediction failed'}), 500

@app.route('/estimate-material-value', methods=['POST'])
def estimate_material_value():
    """Estimate material value based on device composition."""
    try:
        data = request.get_json()
        
        required_fields = ['device_type', 'condition', 'weight']
        if not all(field in data for field in required_fields):
            return jsonify({'error': 'Missing required fields'}), 400
        
        # Estimate material value
        result = material_estimator.estimate(
            device_type=data['device_type'],
            condition=data['condition'],
            weight=data['weight'],
            brand=data.get('brand'),
            model=data.get('model')
        )
        
        return jsonify({
            'success': True,
            'estimated_value': float(result['estimated_value']),
            'material_breakdown': result['material_breakdown'],
            'refurbishment_potential': result['refurbishment_potential'],
            'market_value': float(result['market_value'])
        })
        
    except Exception as e:
        logger.error(f"Material estimation error: {e}")
        return jsonify({'error': 'Estimation failed'}), 500

@app.route('/optimize-route', methods=['POST'])
def optimize_route():
    """Optimize pickup route for multiple locations."""
    try:
        data = request.get_json()
        
        if 'locations' not in data:
            return jsonify({'error': 'No locations provided'}), 400
        
        # Simple route optimization (placeholder)
        # In production, use Google OR-Tools or similar
        locations = data['locations']
        optimized_route = optimize_pickup_route(locations)
        
        return jsonify({
            'success': True,
            'optimized_route': optimized_route,
            'total_distance': calculate_total_distance(optimized_route),
            'estimated_time': calculate_estimated_time(optimized_route)
        })
        
    except Exception as e:
        logger.error(f"Route optimization error: {e}")
        return jsonify({'error': 'Optimization failed'}), 500

def optimize_pickup_route(locations):
    """Simple route optimization algorithm."""
    # Placeholder implementation
    # In production, use proper algorithms like TSP solvers
    return sorted(locations, key=lambda x: (x.get('latitude', 0), x.get('longitude', 0)))

def calculate_total_distance(route):
    """Calculate total distance for route."""
    # Placeholder implementation
    return len(route) * 5.0  # Assume 5km between each pickup

def calculate_estimated_time(route):
    """Calculate estimated time for route."""
    # Placeholder implementation
    return len(route) * 30  # Assume 30 minutes per pickup

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    # Initialize models on startup
    initialize_models()
    
    # Run the app
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('FLASK_ENV') == 'development'
    
    logger.info(f"Starting AI Model Server on port {port}")
    app.run(host='0.0.0.0', port=port, debug=debug)
