@echo off
echo ========================================
echo Skill & Resource Management System
echo Setup Verification Script
echo ========================================
echo.

echo Checking prerequisites...
echo.

echo [1/4] Checking Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is NOT installed
    echo Please install Node.js from https://nodejs.org/
) else (
    echo ✅ Node.js is installed
    node --version
)
echo.

echo [2/4] Checking npm...
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is NOT installed
) else (
    echo ✅ npm is installed
    npm --version
)
echo.

echo [3/4] Checking MySQL...
mysql --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ MySQL is NOT installed or not in PATH
    echo Please install MySQL from https://dev.mysql.com/downloads/
) else (
    echo ✅ MySQL is installed
    mysql --version
)
echo.

echo [4/4] Checking project structure...
if exist "backend\package.json" (
    echo ✅ Backend folder found
) else (
    echo ❌ Backend folder missing
)

if exist "frontend\package.json" (
    echo ✅ Frontend folder found
) else (
    echo ❌ Frontend folder missing
)

if exist "database\schema.sql" (
    echo ✅ Database schema found
) else (
    echo ❌ Database schema missing
)
echo.

echo ========================================
echo Setup Status Summary
echo ========================================
echo.

if exist "backend\.env" (
    echo ✅ Backend .env file exists
) else (
    echo ⚠️  Backend .env file NOT found
    echo    Run: cd backend ^&^& copy .env.example .env
)

if exist "backend\node_modules" (
    echo ✅ Backend dependencies installed
) else (
    echo ⚠️  Backend dependencies NOT installed
    echo    Run: cd backend ^&^& npm install
)

if exist "frontend\node_modules" (
    echo ✅ Frontend dependencies installed
) else (
    echo ⚠️  Frontend dependencies NOT installed
    echo    Run: cd frontend ^&^& npm install
)
echo.

echo ========================================
echo Next Steps
echo ========================================
echo.
echo 1. Setup database:
echo    mysql -u root -p ^< database\schema.sql
echo.
echo 2. Configure backend:
echo    cd backend
echo    copy .env.example .env
echo    Edit .env with your MySQL password
echo    npm install
echo.
echo 3. Start backend:
echo    cd backend
echo    npm start
echo.
echo 4. Start frontend (new terminal):
echo    cd frontend
echo    npm install
echo    npm start
echo.
echo For detailed instructions, see QUICK_START.md
echo ========================================

pause
