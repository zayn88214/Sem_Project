import os
import logging
import pickle
from pathlib import Path
from ..utils.config import settings

logger = logging.getLogger(__name__)

class ModelLoader:
    """Singleton class for loading and managing ML models"""
    
    disease_model = None
    crop_model = None
    disease_model_loaded = False
    crop_model_loaded = False
    
    @classmethod
    def load_disease_model(cls):
        """Load the disease detection model (TensorFlow/Keras H5 format)"""
        if cls.disease_model_loaded:
            logger.info("Disease model already loaded")
            return cls.disease_model
        
        try:
            try:
                import tensorflow as tf
            except ImportError:
                logger.error("TensorFlow is required for disease detection")
                logger.warning("Install it with: pip install tensorflow>=2.13.0")
                logger.info("Using mock model for development...")
                cls.disease_model = "mock_disease_model"
                cls.disease_model_loaded = True
                return cls.disease_model
            
            # Try multiple possible model locations
            possible_paths = [
                Path(__file__).parent.parent.parent / "models" / "efficientnetv2s_PLANT_DISEASE.h5",
                Path("models/efficientnetv2s_PLANT_DISEASE.h5"),
                Path("ml/models/efficientnetv2s_PLANT_DISEASE.h5"),
                Path(settings.DISEASE_MODEL_PATH),
            ]
            
            # Try loading TensorFlow model
            for model_path in possible_paths:
                if os.path.exists(model_path):
                    try:
                        cls.disease_model = tf.keras.models.load_model(str(model_path))
                        logger.info(f"✓ Disease model loaded from {model_path} (TensorFlow/Keras)")
                        logger.info(f"  Input shape: {cls.disease_model.input_shape}")
                        logger.info(f"  Output classes: {cls.disease_model.output_shape[-1]}")
                        cls.disease_model_loaded = True
                        return cls.disease_model
                    except Exception as e:
                        logger.warning(f"Failed to load TensorFlow model from {model_path}: {str(e)}")
                        continue
            
            # If we get here, model not found
            logger.warning(f"Disease model not found at expected paths")
            logger.info("Using mock model for development...")
            cls.disease_model = "mock_disease_model"
            cls.disease_model_loaded = True
            return cls.disease_model
            
        except Exception as e:
            logger.error(f"Failed to load disease model: {str(e)}")
            logger.warning("Using mock disease model as fallback")
            cls.disease_model = "mock_disease_model"
            cls.disease_model_loaded = True
            return cls.disease_model
    
    @classmethod
    def load_crop_model(cls):
        """Load the Random Forest crop recommendation model"""
        if cls.crop_model_loaded:
            logger.info("Crop model already loaded")
            return cls.crop_model
        
        try:
            model_path = settings.CROP_MODEL_PATH
            
            # Check if model file exists
            if not os.path.exists(model_path):
                logger.warning(f"Crop model not found at {model_path}")
                logger.info("Using mock model for development...")
                cls.crop_model = "mock_crop_model"
                cls.crop_model_loaded = True
                return cls.crop_model
            
            with open(model_path, 'rb') as f:
                cls.crop_model = pickle.load(f)
            logger.info(f"✓ Crop model loaded from {model_path}")
            cls.crop_model_loaded = True
            return cls.crop_model
            
        except Exception as e:
            logger.error(f"Failed to load crop model: {str(e)}")
            logger.warning("Using mock crop model as fallback")
            cls.crop_model = "mock_crop_model"
            cls.crop_model_loaded = True
            return cls.crop_model
    
    @classmethod
    def unload_models(cls):
        """Unload models from memory"""
        cls.disease_model = None
        cls.crop_model = None
        cls.disease_model_loaded = False
        cls.crop_model_loaded = False
        logger.info("Models unloaded from memory")
