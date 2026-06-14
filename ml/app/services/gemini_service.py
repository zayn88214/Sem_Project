import google.generativeai as genai
import os
from PIL import Image
import json
import logging
from ..utils.config import settings

logger = logging.getLogger(__name__)

class GeminiService:
    _instance = None
    
    @classmethod
    def get_model(cls, model_name="gemini-1.5-flash"):
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            logger.warning("GEMINI_API_KEY not found in environment")
            return None
        
        genai.configure(api_key=api_key)
        return genai.GenerativeModel(model_name)

    @classmethod
    async def analyze_image(cls, image_data: Image.Image):
        """
        Analyze plant leaf image using Gemini Vision
        """
        api_key = settings.GEMINI_API_KEY
        if not api_key or "your_gemini_api_key_here" in api_key:
            logger.warning("GEMINI_API_KEY not set correctly. Using simulated Gemini response...")
            # Simulate a successful Gemini response for UX purposes
            return {
                "disease": "Tomato Late Blight (Simulated)",
                "confidence": 0.92,
                "severity": "high",
                "treatment": "Apply copper-based fungicides and remove infected leaves immediately. Ensure better air circulation.",
                "prevention": "Use resistant varieties, avoid overhead watering, and rotate crops annually."
            }

        model = cls.get_model()
        if not model:
            return None
        
        prompt = """
        Analyze this plant leaf image. Identify the plant and the specific disease it has.
        Provide the result in the following JSON format:
        {
            "disease": "Specific Disease Name (or 'Healthy')",
            "confidence": 0.95,
            "severity": "low/medium/high",
            "treatment": "Clear treatment steps",
            "prevention": "Clear prevention tips"
        }
        Only return the JSON.
        """
        
        try:
            response = model.generate_content([prompt, image_data])
            # Extract JSON from response
            text = response.text
            start = text.find('{')
            end = text.rfind('}') + 1
            if start != -1 and end != -1:
                return json.loads(text[start:end])
            return None
        except Exception as e:
            logger.error(f"Gemini image analysis failed: {str(e)}")
            return None

    @classmethod
    async def analyze_text(cls, symptoms: str):
        """
        Analyze plant symptoms using Gemini Pro
        """
        api_key = settings.GEMINI_API_KEY
        if not api_key or "your_gemini_api_key_here" in api_key:
            logger.warning("GEMINI_API_KEY not set correctly. Using simulated Gemini response...")
            return {
                "disease": "Apple Scab (Simulated)",
                "confidence": 0.88,
                "severity": "medium",
                "treatment": "Prune affected branches and apply sulfur-based fungicides during the growing season.",
                "prevention": "Maintain proper tree spacing and remove fallen leaves in autumn."
            }

        model = cls.get_model()
        if not model:
            return None
            
        prompt = f"""
        A farmer has described the following plant symptoms: "{symptoms}"
        Identify the most likely plant and disease.
        Provide the result in the following JSON format:
        {{
            "disease": "Specific Disease Name (or 'Healthy')",
            "confidence": 0.85,
            "severity": "low/medium/high",
            "treatment": "Clear treatment steps",
            "prevention": "Clear prevention tips"
        }}
        Only return the JSON.
        """
        
        try:
            response = model.generate_content(prompt)
            text = response.text
            start = text.find('{')
            end = text.rfind('}') + 1
            if start != -1 and end != -1:
                return json.loads(text[start:end])
            return None
        except Exception as e:
            logger.error(f"Gemini text analysis failed: {str(e)}")
            return None
