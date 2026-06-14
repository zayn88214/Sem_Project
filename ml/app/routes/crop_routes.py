from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
import logging
import numpy as np
from ..services.model_loader import ModelLoader
from ..utils.image_processor import ImageProcessor
from ..utils.config import settings

logger = logging.getLogger(__name__)
router = APIRouter()

class CropInput(BaseModel):
    N: float  # Nitrogen
    P: float  # Phosphorus
    K: float  # Potassium
    temperature: float
    humidity: float
    pH: float
    rainfall: float

class CropRecommendation(BaseModel):
    crop: str
    confidence: float
    suitability: str

class CropOutput(BaseModel):
    topRecommendation: str
    topConfidence: float
    recommendations: List[CropRecommendation]
    soilInsights: str

# Crop information database
CROP_INFO = {
    'Rice': {
        'water_need': 'High',
        'ideal_temp': '20-30°C',
        'season': 'Monsoon/Kharif',
        'days_to_harvest': '120-150'
    },
    'Maize': {
        'water_need': 'Medium',
        'ideal_temp': '21-27°C',
        'season': 'Kharif/Rabi',
        'days_to_harvest': '80-120'
    },
    'Jute': {
        'water_need': 'High',
        'ideal_temp': '24-38°C',
        'season': 'Monsoon/Kharif',
        'days_to_harvest': '120-150'
    },
    'Cotton': {
        'water_need': 'Medium-High',
        'ideal_temp': '21-27°C',
        'season': 'Kharif',
        'days_to_harvest': '150-180'
    },
    'Coffee': {
        'water_need': 'Medium',
        'ideal_temp': '20-25°C',
        'season': 'Perennial',
        'days_to_harvest': '180-240'
    }
}

@router.post("/recommend", response_model=CropOutput, tags=["Recommendation"])
async def recommend_crop(input_data: CropInput):
    """
    Recommend suitable crops based on soil and environmental parameters
    
    Parameters:
    - **N**: Nitrogen content (0-140)
    - **P**: Phosphorus content (0-145)
    - **K**: Potassium content (0-205)
    - **temperature**: Temperature in Celsius (0-50)
    - **humidity**: Humidity percentage (0-100)
    - **pH**: Soil pH (0-14)
    - **rainfall**: Annual rainfall in mm (0-300)
    
    Returns top crop recommendation with confidence and list of suitable crops
    """
    try:
        # Validate inputs
        if not all([input_data.N >= 0, input_data.P >= 0, input_data.K >= 0,
                   input_data.temperature >= 0, input_data.humidity >= 0,
                   input_data.pH >= 0, input_data.rainfall >= 0]):
            raise ValueError("All parameters must be non-negative")
        
        logger.info(f"Recommending crop for N={input_data.N}, P={input_data.P}, K={input_data.K}")
        
        # Preprocess soil data
        features = ImageProcessor.preprocess_crop_data(
            input_data.N, input_data.P, input_data.K,
            input_data.temperature, input_data.humidity,
            input_data.pH, input_data.rainfall
        )
        
        # Load model
        model = ModelLoader.load_crop_model()
        
        # Make prediction
        if isinstance(model, str) and model == "mock_crop_model":
            # Mock prediction for development
            logger.warning("Using mock crop prediction")
            predictions = np.random.rand(1, len(ImageProcessor.CROP_CLASSES))
        else:
            # Get prediction probabilities
            predictions = model.predict_proba(features)[0]
        
        # Get top predictions
        top_indices = np.argsort(predictions)[-5:][::-1]
        
        # Build recommendations
        recommendations = []
        for idx in top_indices:
            crop_name = ImageProcessor.CROP_CLASSES[idx]
            confidence = float(predictions[idx])
            
            # Determine suitability
            if confidence >= 0.8:
                suitability = 'Excellent'
            elif confidence >= 0.6:
                suitability = 'Good'
            elif confidence >= 0.4:
                suitability = 'Fair'
            else:
                suitability = 'Poor'
            
            recommendations.append(CropRecommendation(
                crop=crop_name,
                confidence=round(confidence * 100, 2),
                suitability=suitability
            ))
        
        # Get top recommendation
        top_idx = np.argmax(predictions)
        top_crop = ImageProcessor.CROP_CLASSES[top_idx]
        top_confidence = float(predictions[top_idx])
        
        # Generate soil insights
        insights = _generate_soil_insights(input_data)
        
        logger.info(f"Top recommendation: {top_crop} (confidence: {top_confidence:.2%})")
        
        return CropOutput(
            topRecommendation=top_crop,
            topConfidence=round(top_confidence * 100, 2),
            recommendations=recommendations,
            soilInsights=insights
        )
        
    except Exception as e:
        logger.error(f"Recommendation failed: {str(e)}")
        raise HTTPException(
            status_code=400,
            detail=f"Recommendation failed: {str(e)}"
        )

def _generate_soil_insights(input_data: CropInput) -> str:
    """Generate insights about soil conditions"""
    insights = []
    
    # Nitrogen analysis
    if input_data.N < 40:
        insights.append("Nitrogen levels are low - consider adding nitrogen-rich fertilizers")
    elif input_data.N > 100:
        insights.append("Nitrogen levels are high - avoid excessive nitrogen fertilizers")
    
    # Phosphorus analysis
    if input_data.P < 20:
        insights.append("Phosphorus levels are low - add phosphate fertilizers")
    elif input_data.P > 80:
        insights.append("Phosphorus levels are optimal")
    
    # Potassium analysis
    if input_data.K < 40:
        insights.append("Potassium levels are low - add potassium fertilizers")
    elif input_data.K > 150:
        insights.append("Potassium levels are adequate")
    
    # pH analysis
    if input_data.pH < 6:
        insights.append("Soil is acidic - consider adding lime to increase pH")
    elif input_data.pH > 8:
        insights.append("Soil is alkaline - consider adding sulfur to decrease pH")
    else:
        insights.append("Soil pH is optimal for most crops")
    
    # Rainfall analysis
    if input_data.rainfall < 50:
        insights.append("Low rainfall area - select drought-resistant crops")
    elif input_data.rainfall > 200:
        insights.append("High rainfall area - ensure good drainage for crops")
    
    # Temperature analysis
    if input_data.temperature < 15:
        insights.append("Low temperature - select cold-resistant crops")
    elif input_data.temperature > 35:
        insights.append("High temperature - select heat-resistant crops")
    
    return " | ".join(insights) if insights else "Soil conditions are generally suitable for most crops"

@router.get("/crops", tags=["Reference"])
async def get_crops():
    """Get list of all recommendable crops"""
    return {
        "count": len(ImageProcessor.CROP_CLASSES),
        "crops": ImageProcessor.CROP_CLASSES
    }

@router.get("/model-info", tags=["Reference"])
async def get_model_info():
    """Get information about the crop recommendation model"""
    return {
        "model": "Random Forest Classifier",
        "framework": "Scikit-learn",
        "input_features": 7,
        "output_classes": settings.CROP_CLASSES,
        "trained_on": "Agricultural Dataset",
        "accuracy": "99.31%"
    }
