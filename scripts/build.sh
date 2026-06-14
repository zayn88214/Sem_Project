#!/bin/bash
# AGROCORE - Build for production

set -e

echo "========================================="
echo "🏗️  AGROCORE - Production Build"
echo "========================================="
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found"
    exit 1
fi

# Build frontend
echo "📦 Building frontend..."
npm --prefix frontend run build

# Build backend (if needed)
echo "📦 Building backend..."
# Note: Node.js doesn't typically need building, but TypeScript would

echo ""
echo "========================================="
echo "✅ Production build completed!"
echo "========================================="
echo ""
echo "Frontend:  frontend/dist/"
echo "Backend:   backend/src/"
echo ""
echo "To run in production:"
echo "  npm --prefix backend start"
echo "  npm --prefix frontend preview"
echo ""
