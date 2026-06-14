@echo off
REM AGROCORE - Start all services in development mode (Windows)

echo.
echo =========================================
echo 🚀 AGROCORE - Development Server ^(Windows^)
echo =========================================
echo.

REM Check if .env exists
if not exist ".env" (
    echo ❌ .env file not found!
    echo 📝 Creating .env from .env.example...
    copy .env.example .env
    echo ✅ .env created. Please update with your settings.
    exit /b 1
)

REM Create necessary directories
if not exist "backend\logs" mkdir backend\logs
if not exist "backend\uploads" mkdir backend\uploads
if not exist "ml\models" mkdir ml\models

echo.
echo =========================================
echo 🌐 Starting Services
echo =========================================
echo.
echo Frontend:   http://localhost:5173
echo Backend:    http://localhost:5000/api
echo ML Service: http://localhost:8000/docs
echo.
echo Opening services...
echo.

REM Start services in separate terminals
start "AGROCORE Backend" cmd /k "npm --prefix backend dev"
start "AGROCORE Frontend" cmd /k "npm --prefix frontend dev"
start "AGROCORE ML Service" cmd /k "cd ml && python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"

echo ✅ Services started in separate windows
echo Press Ctrl+C in each window to stop
