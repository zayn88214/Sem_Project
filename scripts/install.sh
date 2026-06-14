#!/bin/bash
# AGROCORE - Install all dependencies

set -e

echo "========================================="
echo "📦 AGROCORE - Installing Dependencies"
echo "========================================="
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js >= 18.0.0"
    exit 1
fi

# Check Python
if ! command -v python3 &> /dev/null; then
    echo "❌ Python not found. Please install Python >= 3.9.0"
    exit 1
fi

echo "✅ Node.js found: $(node --version)"
echo "✅ Python found: $(python3 --version)"
echo ""

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
npm --prefix frontend install

# Install backend dependencies
echo "📦 Installing backend dependencies..."
npm --prefix backend install

# Create Python virtual environment and install ML dependencies
echo "📦 Installing ML dependencies..."
python3 -m venv ml/venv
source ml/venv/bin/activate
pip install --upgrade pip
pip install -r ml/requirements.txt
deactivate

echo ""
echo "========================================="
echo "✅ All dependencies installed successfully!"
echo "========================================="
echo ""
echo "📝 Next steps:"
echo "1. Copy .env.example to .env"
echo "2. Update .env with your settings"
echo "3. Run: npm run dev"
echo ""
