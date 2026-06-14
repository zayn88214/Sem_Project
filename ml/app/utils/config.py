from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    # Service Configuration
    SERVICE_NAME: str = "AGROCORE ML Service"
    VERSION: str = "1.0.0"
    DEBUG: bool = False
    
    # Model Paths
    DISEASE_MODEL_PATH: str = "/app/models/efficientnetv2s_PLANT_DISEASE.h5"
    CROP_MODEL_PATH: str = "/app/models/random_forest_crop.pkl"
    
    # Image Processing
    IMAGE_SIZE: int = 224
    MAX_FILE_SIZE: int = 10485760  # 10MB
    ALLOWED_EXTENSIONS: list = ["jpg", "jpeg", "png", "gif", "webp"]
    
    # Disease Detection
    DISEASE_CLASSES: int = 38
    MIN_CONFIDENCE: float = 0.5
    
    # Crop Recommendation
    CROP_CLASSES: int = 22
    
    # Performance
    MODEL_BATCH_SIZE: int = 1
    PREDICTION_TIMEOUT: int = 30
    
    # Logging
    LOG_LEVEL: str = "INFO"
    
    # AI Integration
    GEMINI_API_KEY: Optional[str] = None
    
    class Config:
        env_file = ".env"
        case_sensitive = True
        extra = "ignore"

settings = Settings()
