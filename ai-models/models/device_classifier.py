"""
Device Classification Model
Uses a pre-trained CNN (ResNet/MobileNet) to classify e-waste devices from images.
"""

import os
import torch
import torch.nn as nn
import torchvision.transforms as transforms
from torchvision import models
import numpy as np
from PIL import Image
import logging

logger = logging.getLogger(__name__)

class DeviceClassifier:
    """E-waste device classifier using deep learning."""
    
    def __init__(self, model_path=None):
        """Initialize the device classifier."""
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        self.device_classes = [
            'smartphone', 'laptop', 'desktop', 'tablet', 'television',
            'refrigerator', 'washing_machine', 'air_conditioner', 'microwave',
            'printer', 'keyboard', 'mouse', 'monitor', 'speaker', 'camera',
            'battery', 'charger', 'cable', 'other'
        ]
        
        # Material composition database
        self.material_composition = {
            'smartphone': {'plastic': 0.35, 'metal': 0.45, 'glass': 0.15, 'electronic': 0.05},
            'laptop': {'plastic': 0.40, 'metal': 0.35, 'glass': 0.05, 'electronic': 0.20},
            'desktop': {'plastic': 0.30, 'metal': 0.55, 'glass': 0.05, 'electronic': 0.10},
            'tablet': {'plastic': 0.25, 'metal': 0.40, 'glass': 0.30, 'electronic': 0.05},
            'television': {'plastic': 0.50, 'metal': 0.25, 'glass': 0.20, 'electronic': 0.05},
            'refrigerator': {'plastic': 0.15, 'metal': 0.80, 'glass': 0.02, 'electronic': 0.03},
            'washing_machine': {'plastic': 0.20, 'metal': 0.75, 'glass': 0.02, 'electronic': 0.03},
            'microwave': {'plastic': 0.35, 'metal': 0.60, 'glass': 0.02, 'electronic': 0.03},
            'printer': {'plastic': 0.60, 'metal': 0.25, 'glass': 0.05, 'electronic': 0.10},
            'monitor': {'plastic': 0.40, 'metal': 0.25, 'glass': 0.30, 'electronic': 0.05},
            'other': {'plastic': 0.40, 'metal': 0.35, 'glass': 0.15, 'electronic': 0.10}
        }
        
        # Value estimation (INR per kg)
        self.base_values = {
            'smartphone': 250,
            'laptop': 300,
            'desktop': 200,
            'tablet': 200,
            'television': 150,
            'refrigerator': 100,
            'washing_machine': 80,
            'microwave': 120,
            'printer': 180,
            'monitor': 160,
            'other': 100
        }
        
        self.model = self._load_model(model_path)
        self.transform = self._get_transforms()
        
    def _load_model(self, model_path):
        """Load the pre-trained model."""
        try:
            # Use MobileNetV2 for efficiency
            model = models.mobilenet_v2(pretrained=True)
            
            # Modify classifier for our classes
            num_classes = len(self.device_classes)
            model.classifier = nn.Sequential(
                nn.Dropout(0.2),
                nn.Linear(model.last_channel, num_classes)
            )
            
            # Load fine-tuned weights if available
            if model_path and os.path.exists(model_path):
                logger.info(f"Loading model weights from {model_path}")
                model.load_state_dict(torch.load(model_path, map_location=self.device))
            else:
                logger.warning("No pre-trained model found, using base MobileNetV2")
            
            model.to(self.device)
            model.eval()
            
            return model
            
        except Exception as e:
            logger.error(f"Error loading model: {e}")
            # Fallback: return a simple model for demo purposes
            return self._create_dummy_model()
    
    def _create_dummy_model(self):
        """Create a dummy model for demonstration purposes."""
        logger.info("Creating dummy model for demonstration")
        
        class DummyModel(nn.Module):
            def __init__(self, num_classes):
                super().__init__()
                self.features = nn.Sequential(
                    nn.Conv2d(3, 32, 3, stride=2, padding=1),
                    nn.ReLU(inplace=True),
                    nn.AdaptiveAvgPool2d((1, 1))
                )
                self.classifier = nn.Linear(32, num_classes)
            
            def forward(self, x):
                x = self.features(x)
                x = torch.flatten(x, 1)
                x = self.classifier(x)
                return x
        
        model = DummyModel(len(self.device_classes))
        model.to(self.device)
        model.eval()
        return model
    
    def _get_transforms(self):
        """Get image preprocessing transforms."""
        return transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], 
                               std=[0.229, 0.224, 0.225])
        ])
    
    def predict(self, image):
        """Predict device type from image."""
        try:
            # Ensure image is PIL Image
            if not isinstance(image, Image.Image):
                image = Image.fromarray(image)
            
            # Convert to RGB if needed
            if image.mode != 'RGB':
                image = image.convert('RGB')
            
            # Preprocess image
            input_tensor = self.transform(image).unsqueeze(0).to(self.device)
            
            # Make prediction
            with torch.no_grad():
                outputs = self.model(input_tensor)
                probabilities = torch.nn.functional.softmax(outputs[0], dim=0)
                confidence, predicted_idx = torch.max(probabilities, 0)
            
            # Get predicted device type
            device_type = self.device_classes[predicted_idx.item()]
            confidence_score = confidence.item()
            
            # Get material composition and estimated value
            material_comp = self.material_composition.get(device_type, 
                                                         self.material_composition['other'])
            base_value = self.base_values.get(device_type, self.base_values['other'])
            
            # Adjust value based on confidence
            estimated_value = base_value * confidence_score
            
            # Generate recycling instructions
            recycling_instructions = self._get_recycling_instructions(device_type)
            
            return {
                'device_type': device_type,
                'confidence': confidence_score,
                'estimated_value': estimated_value,
                'material_composition': material_comp,
                'recycling_instructions': recycling_instructions,
                'all_probabilities': {
                    self.device_classes[i]: float(probabilities[i])
                    for i in range(len(self.device_classes))
                }
            }
            
        except Exception as e:
            logger.error(f"Prediction error: {e}")
            # Return fallback prediction
            return {
                'device_type': 'other',
                'confidence': 0.5,
                'estimated_value': 100.0,
                'material_composition': self.material_composition['other'],
                'recycling_instructions': 'General e-waste recycling guidelines apply.',
                'all_probabilities': {}
            }
    
    def _get_recycling_instructions(self, device_type):
        """Get recycling instructions for device type."""
        instructions = {
            'smartphone': 'Remove battery and SIM card. Data wipe recommended. Contains precious metals.',
            'laptop': 'Remove battery and hard drive. Data destruction required. High metal recovery value.',
            'desktop': 'Remove hard drives and memory. Separate monitor. Contains valuable metals.',
            'tablet': 'Remove battery if possible. Data wipe required. Handle glass screen carefully.',
            'television': 'Contains CRT or LCD components. Special handling required for lead/mercury.',
            'refrigerator': 'Refrigerant gas must be properly extracted. High metal recovery potential.',
            'washing_machine': 'Drain completely. High metal content. Motor can be recycled separately.',
            'microwave': 'Remove magnetron safely. Contains valuable metals. Radiation safety required.',
            'printer': 'Remove toner/ink cartridges. Separate metal and plastic components.',
            'monitor': 'Similar to TV handling. Contains valuable metals and potentially hazardous materials.',
            'battery': 'Hazardous waste - requires special collection and processing.',
            'other': 'Follow general e-waste recycling guidelines. Check local regulations.'
        }
        
        return instructions.get(device_type, instructions['other'])

# Training utilities (for future model improvement)
def train_model(data_loader, model, criterion, optimizer, device):
    """Train the device classification model."""
    model.train()
    running_loss = 0.0
    correct_predictions = 0
    total_predictions = 0
    
    for inputs, labels in data_loader:
        inputs, labels = inputs.to(device), labels.to(device)
        
        optimizer.zero_grad()
        outputs = model(inputs)
        loss = criterion(outputs, labels)
        loss.backward()
        optimizer.step()
        
        running_loss += loss.item()
        _, predicted = torch.max(outputs.data, 1)
        total_predictions += labels.size(0)
        correct_predictions += (predicted == labels).sum().item()
    
    epoch_loss = running_loss / len(data_loader)
    epoch_acc = correct_predictions / total_predictions
    
    return epoch_loss, epoch_acc

def evaluate_model(data_loader, model, criterion, device):
    """Evaluate the device classification model."""
    model.eval()
    running_loss = 0.0
    correct_predictions = 0
    total_predictions = 0
    
    with torch.no_grad():
        for inputs, labels in data_loader:
            inputs, labels = inputs.to(device), labels.to(device)
            
            outputs = model(inputs)
            loss = criterion(outputs, labels)
            
            running_loss += loss.item()
            _, predicted = torch.max(outputs.data, 1)
            total_predictions += labels.size(0)
            correct_predictions += (predicted == labels).sum().item()
    
    epoch_loss = running_loss / len(data_loader)
    epoch_acc = correct_predictions / total_predictions
    
    return epoch_loss, epoch_acc
