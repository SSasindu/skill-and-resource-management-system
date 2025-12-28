#!/bin/bash

echo "========================================"
echo "Skill & Resource Management System"
echo "Setup Verification Script"
echo "========================================"
echo ""

echo "Checking prerequisites..."
echo ""

echo "[1/4] Checking Node.js..."
if command -v node &> /dev/null; then
    echo "✅ Node.js is installed"
    node --version
else
    echo "❌ Node.js is NOT installed"
    echo "Please install Node.js from https://nodejs.org/"
fi
echo ""

echo "[2/4] Checking npm..."
if command -v npm &> /dev/null; then
    echo "✅ npm is installed"
    npm --version
else
    echo "❌ npm is NOT installed"
fi
echo ""

echo "[3/4] Checking MySQL..."
if command -v mysql &> /dev/null; then
    echo "✅ MySQL is installed"
    mysql --version
else
    echo "❌ MySQL is NOT installed or not in PATH"
    echo "Please install MySQL from https://dev.mysql.com/downloads/"
fi
echo ""

echo "[4/4] Checking project structure..."
if [ -f "backend/package.json" ]; then
    echo "✅ Backend folder found"
else
    echo "❌ Backend folder missing"
fi

if [ -f "frontend/package.json" ]; then
    echo "✅ Frontend folder found"
else
    echo "❌ Frontend folder missing"
fi

if [ -f "database/schema.sql" ]; then
    echo "✅ Database schema found"
else
    echo "❌ Database schema missing"
fi
echo ""

echo "========================================"
echo "Setup Status Summary"
echo "========================================"
echo ""

if [ -f "backend/.env" ]; then
    echo "✅ Backend .env file exists"
else
    echo "⚠️  Backend .env file NOT found"
    echo "   Run: cd backend && cp .env.example .env"
fi

if [ -d "backend/node_modules" ]; then
    echo "✅ Backend dependencies installed"
else
    echo "⚠️  Backend dependencies NOT installed"
    echo "   Run: cd backend && npm install"
fi

if [ -d "frontend/node_modules" ]; then
    echo "✅ Frontend dependencies installed"
else
    echo "⚠️  Frontend dependencies NOT installed"
    echo "   Run: cd frontend && npm install"
fi
echo ""

echo "========================================"
echo "Next Steps"
echo "========================================"
echo ""
echo "1. Setup database:"
echo "   mysql -u root -p < database/schema.sql"
echo ""
echo "2. Configure backend:"
echo "   cd backend"
echo "   cp .env.example .env"
echo "   Edit .env with your MySQL password"
echo "   npm install"
echo ""
echo "3. Start backend:"
echo "   cd backend"
echo "   npm start"
echo ""
echo "4. Start frontend (new terminal):"
echo "   cd frontend"
echo "   npm install"
echo "   npm start"
echo ""
echo "For detailed instructions, see QUICK_START.md"
echo "========================================"
