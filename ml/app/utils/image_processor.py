import io
import numpy as np
from PIL import Image
import requests
import logging
from .config import settings

logger = logging.getLogger(__name__)

class ImageProcessor:
    """Handle image processing for ML predictions"""
    
    DISEASE_CLASSES = [
        'Apple scab', 'Apple Black rot', 'Apple Cedar apple rust', 'Apple healthy', 
        'Blueberry healthy', 'Cherry (including sour) Powdery mildew', 
        'Cherry (including sour) healthy', 'Corn (maize) Cercospora leaf spot Gray leaf spot', 
        'Corn(maize) Common rust', 'Corn(maize) Northern Leaf Blight', 'Corn(maize) healthy', 
        'Grape Black rot', 'Grape Esca(Black Measles)', 'Grape Leaf blight(Isariopsis Leaf Spot)', 
        'Grape healthy', 'Orange Haunglongbing(Citrus greening)', 'Peach Bacterial spot', 
        'Peach healthy', 'Bell PepperBacterial_spot', 'Pepper bell healthy', 
        'Potato Early blight', 'Potato Late blight', 'Potato healthy', 
        'Raspberry healthy', 'Soybean healthy', 'Squash Powdery mildew', 
        'Strawberry Leaf scorch', 'Strawberry healthy', 'Tomato Bacterial spot', 
        'Tomato Early blight', 'Tomato Late blight', 'Tomato Leaf Mold', 
        'Tomato Septoria leaf spot', 'Tomato Spider mites (Two-spotted spider mite)', 
        'Tomato Target Spot', 'Tomato Yellow Leaf Curl Virus', 'Tomato mosaic virus', 
        'Tomato healthy'
    ]
    
    CROP_CLASSES = [
        'Rice', 'Maize', 'Chickpea', 'Kidneybeans', 'Pigeonpeas', 'Mothbeans',
        'Mungbean', 'Blackgram', 'Lentil', 'Pomegranate', 'Banana', 'Mango',
        'Grapes', 'Watermelon', 'Muskmelon', 'Apple', 'Orange', 'Papaya',
        'Coconut', 'Cotton', 'Jute', 'Coffee'
    ]
    
    @staticmethod
    def load_image_from_bytes(image_bytes: bytes) -> Image.Image:
        """Load image from byte content"""
        try:
            image = Image.open(io.BytesIO(image_bytes))
            return image
        except Exception as e:
            logger.error(f"Failed to load image from bytes: {str(e)}")
            raise

    @staticmethod
    def load_image_from_url(image_url: str) -> Image.Image:
        """Load image from URL"""
        try:
            response = requests.get(image_url, timeout=10)
            response.raise_for_status()
            image = Image.open(io.BytesIO(response.content))
            return image
        except Exception as e:
            logger.error(f"Failed to load image from URL: {str(e)}")
            raise
    
    @staticmethod
    def preprocess_image(image: Image.Image, target_size: int = 224) -> np.ndarray:
        """Preprocess image for EfficientNetV2"""
        try:
            # Convert to RGB if necessary
            if image.mode != 'RGB':
                image = image.convert('RGB')
            
            # Resize image
            image = image.resize((target_size, target_size), Image.Resampling.LANCZOS)
            
            # Convert to array
            img_array = np.array(image, dtype=np.float32)
            
            # Add batch dimension
            img_array = np.expand_dims(img_array, axis=0)
            
            return img_array
        except Exception as e:
            logger.error(f"Failed to preprocess image: {str(e)}")
            raise
    
    @staticmethod
    def extract_image_features(image: Image.Image, target_size: int = 224) -> np.ndarray:
        """Extract features from image for scikit-learn model"""
        try:
            # Convert to RGB if necessary
            if image.mode != 'RGB':
                image = image.convert('RGB')
            
            # Resize image
            image = image.resize((target_size, target_size), Image.Resampling.LANCZOS)
            
            # Convert to array
            img_array = np.array(image, dtype=np.float32)
            
            # Extract color histogram features (16 bins per channel = 48 features)
            hist_features = []
            for i in range(3):  # RGB channels
                hist, _ = np.histogram(img_array[:, :, i], bins=16, range=(0, 256))
                hist_features.extend(hist)
            
            # Extract mean and std deviation for each channel (6 features)
            stats_features = []
            for i in range(3):
                stats_features.append(np.mean(img_array[:, :, i]))
                stats_features.append(np.std(img_array[:, :, i]))
            
            # Combine all features (48 + 6 = 54 features total)
            features = np.array([hist_features + stats_features], dtype=np.float32)
            
            return features
        except Exception as e:
            logger.error(f"Failed to extract image features: {str(e)}")
            raise
    
    @staticmethod
    def preprocess_crop_data(N: float, P: float, K: float, 
                            temperature: float, humidity: float, 
                            pH: float, rainfall: float) -> np.ndarray:
        """Preprocess soil data for crop recommendation"""
        try:
            # Create feature vector
            # The model was trained on raw values, so we don't normalize here
            features = np.array([[N, P, K, temperature, humidity, pH, rainfall]], 
                              dtype=np.float32)
            
            return features
        except Exception as e:
            logger.error(f"Failed to preprocess crop data: {str(e)}")
            raise
