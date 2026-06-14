#!/bin/bash
# AGROCORE - Start all services in development mode

set -e

echo "========================================="
echo "🚀 AGROCORE - Development Server"
echo "========================================="
echo ""

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "❌ .env file not found!"
    echo "📝 Creating .env from .env.example..."
    cp .env.example .env
    echo "✅ .env created. Please update with your settings."
    exit 1
fi

# Check if MongoDB is running
echo "🔍 Checking MongoDB..."
if ! nc -z localhost 27017 2>/dev/null; then
    echo "⚠️  MongoDB is not running on localhost:27017"
    echo "📝 Starting MongoDB..."
    if command -v mongod &> /dev/null; then
        mongod --fork --logpath /tmp/mongodb.log --dbpath ./db
        sleep 2
    else
        echo "❌ MongoDB not found. Please install or start MongoDB manually."
        exit 1
    fi
fi

# Create necessary directories
mkdir -p backend/logs backend/uploads ml/models

# Check Node.js and Python
echo "🔍 Checking dependencies..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js >= 18.0.0"
    exit 1
fi

if ! command -v python3 &> /dev/null; then
    echo "❌ Python not found. Please install Python >= 3.9.0"
    exit 1
fi

echo "✅ Dependencies found"
echo ""

# Install dependencies if needed
if [ ! -d "backend/node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    npm --prefix backend install
fi

if [ ! -d "frontend/node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    npm --prefix frontend install
fi

if [ ! -d "ml/venv" ]; then
    echo "📦 Creating Python virtual environment..."
    python3 -m venv ml/venv
    source ml/venv/bin/activate
    pip install -r ml/requirements.txt
fi

echo ""
echo "========================================="
echo "🌐 Starting Services"
echo "========================================="
echo ""
echo "Frontend:  http://localhost:5173"
echo "Backend:   http://localhost:5000/api"
echo "ML Service: http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop all services"
echo "========================================="
echo ""

# Start all services in parallel
npm --prefix backend dev &
BACKEND_PID=$!

npm --prefix frontend dev &
FRONTEND_PID=$!

source ml/venv/bin/activate
python -m uvicorn ml.app.main:app --reload --host 0.0.0.0 --port 8000 &
ML_PID=$!

# Handle termination
trap "kill $BACKEND_PID $FRONTEND_PID $ML_PID 2>/dev/null; exit 0" SIGINT SIGTERM

# Wait for all processes
wait $BACKEND_PID $FRONTEND_PID $ML_PID

echo ""
echo "✅ All services stopped"
