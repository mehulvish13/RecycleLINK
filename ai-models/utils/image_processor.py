"""
Image Processing Utilities
Handles image preprocessing for device classification models.
"""

import cv2
import numpy as np
from PIL import Image
import logging
from io import BytesIO
from typing import Union, Tuple

logger = logging.getLogger(__name__)

class ImageProcessor:
    """Image preprocessing utilities for e-waste device classification."""
    
    def __init__(self, target_size: Tuple[int, int] = (224, 224)):
        """Initialize image processor."""
        self.target_size = target_size
        self.supported_formats = ['jpg', 'jpeg', 'png', 'bmp', 'tiff']
    
    def process_uploaded_image(self, image_file) -> Image.Image:
        """Process uploaded image file for model inference."""
        try:
            # Read image from file upload
            if hasattr(image_file, 'read'):
                # Flask file upload object
                image_bytes = image_file.read()
                image = Image.open(BytesIO(image_bytes))
            elif isinstance(image_file, (str, bytes)):
                # File path or bytes
                if isinstance(image_file, str):
                    image = Image.open(image_file)
                else:
                    image = Image.open(BytesIO(image_file))
            else:
                raise ValueError("Unsupported image input type")
            
            # Process the image
            processed_image = self.preprocess_image(image)
            
            return processed_image
            
        except Exception as e:
            logger.error(f"Image processing error: {e}")
            # Return a default blank image
            return Image.new('RGB', self.target_size, color='white')
    
    def preprocess_image(self, image: Image.Image) -> Image.Image:
        """Preprocess image for model inference."""
        try:
            # Convert to RGB if needed
            if image.mode != 'RGB':
                image = image.convert('RGB')
            
            # Resize image
            image = image.resize(self.target_size, Image.Resampling.LANCZOS)
            
            # Apply basic enhancement
            image = self.enhance_image(image)
            
            return image
            
        except Exception as e:
            logger.error(f"Image preprocessing error: {e}")
            return image
    
    def enhance_image(self, image: Image.Image) -> Image.Image:
        """Apply basic image enhancement."""
        try:
            # Convert to numpy array for OpenCV processing
            img_array = np.array(image)
            
            # Apply CLAHE (Contrast Limited Adaptive Histogram Equalization)
            lab = cv2.cvtColor(img_array, cv2.COLOR_RGB2LAB)
            clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
            lab[:, :, 0] = clahe.apply(lab[:, :, 0])
            enhanced = cv2.cvtColor(lab, cv2.COLOR_LAB2RGB)
            
            # Apply slight sharpening
            kernel = np.array([[-1, -1, -1],
                              [-1,  9, -1],
                              [-1, -1, -1]])
            sharpened = cv2.filter2D(enhanced, -1, kernel * 0.1)
            
            # Blend original and sharpened
            result = cv2.addWeighted(enhanced, 0.8, sharpened, 0.2, 0)
            
            # Convert back to PIL Image
            return Image.fromarray(result)
            
        except Exception as e:
            logger.error(f"Image enhancement error: {e}")
            return image
    
    def extract_features(self, image: Image.Image) -> dict:
        """Extract basic image features for analysis."""
        try:
            img_array = np.array(image)
            
            # Color analysis
            mean_rgb = np.mean(img_array, axis=(0, 1))
            dominant_color = self._get_dominant_color(img_array)
            
            # Texture analysis
            gray = cv2.cvtColor(img_array, cv2.COLOR_RGB2GRAY)
            texture_variance = np.var(gray)
            
            # Edge detection
            edges = cv2.Canny(gray, 50, 150)
            edge_density = np.sum(edges) / (edges.shape[0] * edges.shape[1])
            
            # Brightness and contrast
            brightness = np.mean(gray)
            contrast = np.std(gray)
            
            return {
                'mean_rgb': mean_rgb.tolist(),
                'dominant_color': dominant_color,
                'texture_variance': float(texture_variance),
                'edge_density': float(edge_density),
                'brightness': float(brightness),
                'contrast': float(contrast),
                'image_size': image.size
            }
            
        except Exception as e:
            logger.error(f"Feature extraction error: {e}")
            return {}
    
    def _get_dominant_color(self, img_array: np.ndarray) -> list:
        """Get dominant color using K-means clustering."""
        try:
            # Reshape image to be a list of pixels
            pixels = img_array.reshape(-1, 3)
            
            # Use K-means to find dominant colors
            from sklearn.cluster import KMeans
            kmeans = KMeans(n_clusters=3, random_state=42, n_init=10)
            kmeans.fit(pixels)
            
            # Get the most frequent cluster center
            labels = kmeans.labels_
            label_counts = np.bincount(labels)
            dominant_cluster = np.argmax(label_counts)
            dominant_color = kmeans.cluster_centers_[dominant_cluster]
            
            return dominant_color.astype(int).tolist()
            
        except Exception as e:
            logger.error(f"Dominant color extraction error: {e}")
            return [128, 128, 128]  # Default gray
    
    def detect_objects(self, image: Image.Image) -> list:
        """Basic object detection using contours."""
        try:
            img_array = np.array(image)
            gray = cv2.cvtColor(img_array, cv2.COLOR_RGB2GRAY)
            
            # Apply Gaussian blur
            blurred = cv2.GaussianBlur(gray, (5, 5), 0)
            
            # Threshold to get binary image
            _, thresh = cv2.threshold(blurred, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
            
            # Find contours
            contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
            
            # Filter contours by area
            min_area = (image.width * image.height) * 0.01  # At least 1% of image
            objects = []
            
            for contour in contours:
                area = cv2.contourArea(contour)
                if area > min_area:
                    x, y, w, h = cv2.boundingRect(contour)
                    objects.append({
                        'bbox': [x, y, w, h],
                        'area': area,
                        'aspect_ratio': w / h if h > 0 else 0
                    })
            
            # Sort by area (largest first)
            objects = sorted(objects, key=lambda x: x['area'], reverse=True)
            
            return objects[:5]  # Return top 5 objects
            
        except Exception as e:
            logger.error(f"Object detection error: {e}")
            return []
    
    def validate_image(self, image_file) -> tuple:
        """Validate uploaded image file."""
        try:
            # Check file size (max 10MB)
            max_size = 10 * 1024 * 1024  # 10MB
            if hasattr(image_file, 'content_length') and image_file.content_length > max_size:
                return False, "File size too large (max 10MB)"
            
            # Check file format
            if hasattr(image_file, 'filename'):
                file_ext = image_file.filename.split('.')[-1].lower()
                if file_ext not in self.supported_formats:
                    return False, f"Unsupported format. Supported: {', '.join(self.supported_formats)}"
            
            # Try to open and validate image
            if hasattr(image_file, 'read'):
                image_file.seek(0)  # Reset file pointer
                image_bytes = image_file.read()
                image = Image.open(BytesIO(image_bytes))
                image_file.seek(0)  # Reset for later use
            else:
                image = Image.open(image_file)
            
            # Check image dimensions
            if image.width < 50 or image.height < 50:
                return False, "Image too small (minimum 50x50 pixels)"
            
            if image.width > 4096 or image.height > 4096:
                return False, "Image too large (maximum 4096x4096 pixels)"
            
            return True, "Valid image"
            
        except Exception as e:
            return False, f"Invalid image file: {str(e)}"

# Utility functions
def resize_image(image: Image.Image, size: Tuple[int, int], 
                maintain_aspect: bool = True) -> Image.Image:
    """Resize image with optional aspect ratio maintenance."""
    if maintain_aspect:
        image.thumbnail(size, Image.Resampling.LANCZOS)
        # Create new image with target size and paste resized image
        new_image = Image.new('RGB', size, color='white')
        paste_x = (size[0] - image.width) // 2
        paste_y = (size[1] - image.height) // 2
        new_image.paste(image, (paste_x, paste_y))
        return new_image
    else:
        return image.resize(size, Image.Resampling.LANCZOS)

def augment_image(image: Image.Image) -> list:
    """Generate augmented versions of image for training."""
    augmented = [image]  # Original
    
    try:
        # Rotation
        for angle in [-10, 10]:
            rotated = image.rotate(angle, expand=False, fillcolor='white')
            augmented.append(rotated)
        
        # Brightness adjustment
        from PIL import ImageEnhance
        enhancer = ImageEnhance.Brightness(image)
        augmented.append(enhancer.enhance(0.8))  # Darker
        augmented.append(enhancer.enhance(1.2))  # Brighter
        
        # Contrast adjustment
        enhancer = ImageEnhance.Contrast(image)
        augmented.append(enhancer.enhance(0.8))  # Lower contrast
        augmented.append(enhancer.enhance(1.2))  # Higher contrast
        
    except Exception as e:
        logger.error(f"Image augmentation error: {e}")
    
    return augmented
