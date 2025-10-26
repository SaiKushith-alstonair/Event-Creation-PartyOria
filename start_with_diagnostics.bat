@echo off
echo Starting PartyOria Event Management System with Diagnostics...
echo.

echo Checking if Node.js is installed...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo Node.js version:
node --version

echo.
echo Checking if npm is available...
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: npm is not available
    pause
    exit /b 1
)

echo npm version:
npm --version

echo.
echo Navigating to frontend directory...
cd /d "%~dp0frontend"

echo.
echo Checking if node_modules exists...
if not exist "node_modules" (
    echo node_modules not found. Installing dependencies...
    npm install
    if %errorlevel% neq 0 (
        echo ERROR: Failed to install dependencies
        pause
        exit /b 1
    )
) else (
    echo node_modules found.
)

echo.
echo Starting development server...
echo.
echo The server will start on http://localhost:5173 (Vite default)
echo If you see a 404 error, check the console for detailed error information.
echo.
echo Available console commands after the page loads:
echo - showSystemInfo() - Display system information
echo - clearErrors() - Clear all logged errors  
echo - Copy and paste the diagnostic.js content to run full diagnostics
echo.

start "" "http://localhost:5173"
npm run dev

pause