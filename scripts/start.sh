#!/bin/bash
# AGROCORE - Run production server

set -e

echo "========================================="
echo "🚀 AGROCORE - Production Server"
echo "========================================="
echo ""

if [ ! -f ".env" ]; then
    echo "❌ .env file not found!"
    exit 1
fi

echo "📝 Starting backend server..."
echo "🌐 Server running at http://localhost:5000"
echo ""

npm --prefix backend start
