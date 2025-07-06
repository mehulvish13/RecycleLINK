"""
Material Value Estimator
Estimates the value of materials that can be recovered from e-waste items.
"""

import pandas as pd
import numpy as np
import logging
from typing import Dict, Any, Optional

logger = logging.getLogger(__name__)

class MaterialEstimator:
    """Estimates material value from e-waste based on composition and market prices."""
    
    def __init__(self):
        """Initialize the material estimator."""
        # Material prices (INR per kg) - based on Indian market
        self.material_prices = {
            'plastic': 15,  # Mixed plastic
            'metal': 45,    # Mixed metals
            'aluminum': 120,
            'copper': 400,
            'steel': 25,
            'gold': 4500000,  # INR per kg
            'silver': 65000,
            'palladium': 3500000,
            'glass': 8,
            'electronic': 80,  # Electronic components
            'rare_earth': 2000,
            'lithium': 8000,  # For batteries
        }
        
        # Device material composition (refined estimates)
        self.device_compositions = {
            'smartphone': {
                'plastic': 0.35, 'aluminum': 0.15, 'glass': 0.15, 
                'copper': 0.08, 'steel': 0.10, 'gold': 0.0001, 
                'silver': 0.0005, 'rare_earth': 0.02, 'electronic': 0.13
            },
            'laptop': {
                'plastic': 0.40, 'aluminum': 0.20, 'glass': 0.05,
                'copper': 0.12, 'steel': 0.08, 'gold': 0.0002,
                'silver': 0.001, 'rare_earth': 0.03, 'electronic': 0.11
            },
            'desktop': {
                'plastic': 0.30, 'steel': 0.35, 'aluminum': 0.10,
                'copper': 0.15, 'glass': 0.05, 'gold': 0.0003,
                'silver': 0.0015, 'electronic': 0.047
            },
            'tablet': {
                'plastic': 0.25, 'aluminum': 0.35, 'glass': 0.30,
                'copper': 0.05, 'gold': 0.00005, 'silver': 0.0002,
                'electronic': 0.043
            },
            'television': {
                'plastic': 0.50, 'steel': 0.15, 'aluminum': 0.10,
                'glass': 0.20, 'copper': 0.03, 'electronic': 0.02
            },
            'refrigerator': {
                'steel': 0.60, 'plastic': 0.15, 'aluminum': 0.15,
                'copper': 0.08, 'electronic': 0.02
            },
            'washing_machine': {
                'steel': 0.70, 'plastic': 0.15, 'aluminum': 0.08,
                'copper': 0.05, 'electronic': 0.02
            },
            'microwave': {
                'steel': 0.50, 'plastic': 0.35, 'aluminum': 0.08,
                'copper': 0.05, 'electronic': 0.02
            },
            'printer': {
                'plastic': 0.60, 'steel': 0.20, 'aluminum': 0.08,
                'copper': 0.08, 'electronic': 0.04
            },
            'monitor': {
                'plastic': 0.40, 'glass': 0.30, 'steel': 0.15,
                'aluminum': 0.10, 'copper': 0.03, 'electronic': 0.02
            },
            'other': {
                'plastic': 0.40, 'metal': 0.35, 'glass': 0.15,
                'electronic': 0.10
            }
        }
        
        # Condition multipliers for material recovery
        self.condition_multipliers = {
            'working': 1.0,
            'partially_working': 0.8,
            'not_working': 0.6,
            'damaged': 0.4
        }
        
        # Brand value multipliers (for refurbishment potential)
        self.brand_multipliers = {
            'apple': 1.5,
            'samsung': 1.3,
            'dell': 1.2,
            'hp': 1.1,
            'lenovo': 1.1,
            'sony': 1.2,
            'lg': 1.1,
            'default': 1.0
        }
    
    def estimate(self, device_type: str, condition: str, weight: float,
                 brand: Optional[str] = None, model: Optional[str] = None) -> Dict[str, Any]:
        """Estimate material value for a device."""
        try:
            # Get device composition
            composition = self.device_compositions.get(device_type, 
                                                     self.device_compositions['other'])
            
            # Calculate material breakdown by weight
            material_breakdown = {}
            total_value = 0
            
            for material, percentage in composition.items():
                material_weight = weight * percentage
                material_value = material_weight * self.material_prices.get(material, 0)
                
                material_breakdown[material] = {
                    'weight_kg': material_weight,
                    'value_inr': material_value,
                    'price_per_kg': self.material_prices.get(material, 0)
                }
                
                total_value += material_value
            
            # Apply condition multiplier
            condition_multiplier = self.condition_multipliers.get(condition, 0.6)
            adjusted_value = total_value * condition_multiplier
            
            # Refurbishment potential assessment
            refurbishment_potential = self._assess_refurbishment_potential(
                device_type, condition, brand
            )
            
            # Market value calculation (for refurbishment)
            market_value = self._calculate_market_value(
                device_type, condition, weight, brand, model
            )
            
            return {
                'estimated_value': adjusted_value,
                'material_breakdown': material_breakdown,
                'condition_multiplier': condition_multiplier,
                'refurbishment_potential': refurbishment_potential,
                'market_value': market_value,
                'recommendations': self._generate_recommendations(
                    device_type, condition, refurbishment_potential, adjusted_value, market_value
                )
            }
            
        except Exception as e:
            logger.error(f"Material estimation error: {e}")
            return {
                'estimated_value': weight * 50,  # Fallback: 50 INR per kg
                'material_breakdown': {},
                'condition_multiplier': 1.0,
                'refurbishment_potential': 'low',
                'market_value': 0,
                'recommendations': ['Contact local recycling center for proper disposal']
            }
    
    def _assess_refurbishment_potential(self, device_type: str, condition: str, 
                                      brand: Optional[str] = None) -> str:
        """Assess refurbishment potential for a device."""
        # Electronics with high refurbishment potential
        high_refurb_devices = ['smartphone', 'laptop', 'tablet', 'desktop', 'monitor']
        
        if device_type not in high_refurb_devices:
            return 'low'
        
        if condition in ['working', 'partially_working']:
            if brand and brand.lower() in ['apple', 'samsung', 'dell', 'hp']:
                return 'high'
            else:
                return 'medium'
        elif condition == 'not_working':
            return 'low'
        else:  # damaged
            return 'none'
    
    def _calculate_market_value(self, device_type: str, condition: str, weight: float,
                               brand: Optional[str] = None, model: Optional[str] = None) -> float:
        """Calculate potential market value if refurbished."""
        if condition == 'damaged':
            return 0
        
        # Base market values (INR) for working condition
        base_values = {
            'smartphone': 3000,
            'laptop': 8000,
            'desktop': 5000,
            'tablet': 4000,
            'monitor': 2000,
            'television': 6000,
            'printer': 1500,
            'other': 1000
        }
        
        base_value = base_values.get(device_type, 1000)
        
        # Apply brand multiplier
        brand_mult = 1.0
        if brand:
            brand_mult = self.brand_multipliers.get(brand.lower(), 
                                                   self.brand_multipliers['default'])
        
        # Apply condition multiplier
        condition_mult = self.condition_multipliers.get(condition, 0.6)
        
        # Weight factor (some correlation with size/features)
        weight_factor = min(2.0, max(0.5, weight / 2.0))
        
        market_value = base_value * brand_mult * condition_mult * weight_factor
        
        return market_value
    
    def _generate_recommendations(self, device_type: str, condition: str, 
                                refurbishment_potential: str, material_value: float,
                                market_value: float) -> list:
        """Generate processing recommendations."""
        recommendations = []
        
        if refurbishment_potential == 'high' and market_value > material_value * 2:
            recommendations.append(f"Consider refurbishment - potential market value: ₹{market_value:.0f}")
            recommendations.append("Data destruction required before refurbishment")
        elif refurbishment_potential in ['medium', 'high']:
            recommendations.append("Evaluate for parts extraction before recycling")
        
        if device_type in ['smartphone', 'laptop', 'tablet']:
            recommendations.append("Remove battery and dispose separately")
            recommendations.append("Ensure data destruction before processing")
        
        if material_value > 100:
            recommendations.append(f"High material recovery value: ₹{material_value:.0f}")
            recommendations.append("Prioritize for material extraction")
        
        # Hazardous material warnings
        if device_type in ['television', 'monitor']:
            recommendations.append("Contains potentially hazardous materials - special handling required")
        
        if device_type in ['refrigerator', 'air_conditioner']:
            recommendations.append("Refrigerant extraction required")
        
        if not recommendations:
            recommendations.append("Standard e-waste recycling process recommended")
        
        return recommendations

# Market data utilities
def update_material_prices(estimator: MaterialEstimator, price_data: Dict[str, float]):
    """Update material prices with current market data."""
    estimator.material_prices.update(price_data)
    logger.info("Material prices updated")

def get_market_trends() -> Dict[str, float]:
    """Get current market trends for materials (mock implementation)."""
    # In production, this would fetch from commodity markets API
    return {
        'copper': 1.05,  # 5% increase
        'aluminum': 0.98,  # 2% decrease
        'gold': 1.02,    # 2% increase
        'silver': 0.95,  # 5% decrease
        'steel': 1.01,   # 1% increase
    }
