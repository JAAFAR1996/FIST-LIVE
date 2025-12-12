#!/bin/bash

echo "🚀 Starting Fish Store Admin System..."
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    pnpm install
fi

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "⚠️  DATABASE_URL not set. Using default from .env"
fi

echo ""
echo "✅ Starting development server..."
echo "📍 Server will be available at: http://localhost:5000"
echo "🔐 Admin login: http://localhost:5000/admin/login"
echo ""
echo "Login credentials:"
echo "  Email: admin@fishstore.com"
echo "  Password: Admin123!@#"
echo ""
echo "Press Ctrl+C to stop the server"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Start the server
pnpm run dev
