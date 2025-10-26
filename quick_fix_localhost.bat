@echo off
echo ========================================
echo PartyOria - Quick Fix for Localhost Issues
echo ========================================
echo.

:: Check if we're in the right directory
if not exist "frontend" (
    echo [ERROR] Please run this script from the project root directory
    pause
    exit /b 1
)

cd frontend

echo [FIX 1] Cleaning and reinstalling dependencies...
if exist "node_modules" (
    echo Removing old node_modules...
    rmdir /s /q node_modules
)

if exist "package-lock.json" (
    echo Removing package-lock.json...
    del package-lock.json
)

echo Installing fresh dependencies...
npm install
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install dependencies
    pause
    exit /b 1
)

echo [FIX 2] Clearing npm cache...
npm cache clean --force

echo [FIX 3] Checking for port conflicts...
echo Killing any processes on port 3000...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3000"') do (
    echo Killing process %%a
    taskkill /f /pid %%a >nul 2>&1
)

echo [FIX 4] Testing build...
npm run build
if %errorlevel% neq 0 (
    echo [WARNING] Build failed, but trying to start dev server anyway...
)

echo [FIX 5] Starting development server...
echo Server should start at http://localhost:3000
echo Press Ctrl+C to stop the server
echo.

npm run dev