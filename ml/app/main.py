from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import os
import numpy as np
from PIL import Image
import io
import requests
from datetime import datetime
import logging

from .routes import disease_routes, crop_routes
from .services.model_loader import ModelLoader
from .utils.config import settings

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="AGROCORE ML Service",
    description="AI-powered agricultural ML inference service",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load models on startup
@app.on_event("startup")
async def startup_event():
    try:
        logger.info("Loading ML models...")
        ModelLoader.load_disease_model()
        ModelLoader.load_crop_model()
        logger.info("✓ All models loaded successfully")
    except Exception as e:
        logger.error(f"✗ Failed to load models: {str(e)}")
        raise

@app.on_event("shutdown")
async def shutdown_event():
    logger.info("Shutting down ML service...")

# ==================== ROUTES ====================

# Health check endpoint
@app.get("/health", tags=["Health"])
async def health_check():
    """Health check endpoint for the ML service"""
    return {
        "status": "UP",
        "service": "AGROCORE ML Service",
        "timestamp": datetime.now().isoformat(),
        "models_loaded": {
            "disease_model": ModelLoader.disease_model is not None,
            "crop_model": ModelLoader.crop_model is not None
        }
    }

# Disease detection routes
app.include_router(disease_routes.router, prefix="/api/disease", tags=["Disease Detection"])

# Crop recommendation routes
app.include_router(crop_routes.router, prefix="/api/crop", tags=["Crop Recommendation"])

# ==================== ERROR HANDLERS ====================

@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "message": exc.detail,
            "timestamp": datetime.now().isoformat()
        }
    )

@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    logger.error(f"Unhandled exception: {str(exc)}")
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "message": "Internal server error",
            "timestamp": datetime.now().isoformat()
        }
    )

# ==================== ROOT ENDPOINT ====================

@app.get("/", tags=["Info"])
async def root():
    """Root endpoint with service information"""
    return {
        "service": "AGROCORE - AI Powered Agricultural Intelligence System",
        "version": "1.0.0",
        "endpoints": {
            "health": "/health",
            "disease_detection": "/api/disease/predict",
            "crop_recommendation": "/api/crop/recommend"
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        log_level="info"
    )
