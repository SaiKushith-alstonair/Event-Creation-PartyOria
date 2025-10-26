@echo off
echo ========================================
echo PartyOria Event Management - Localhost Diagnostic Script
echo ========================================
echo.

:: Set colors for better readability
color 0A

:: Check current directory
echo [STEP 1] Current Directory Check
echo Current directory: %CD%
echo.

:: Check if we're in the right project directory
if not exist "frontend" (
    echo [ERROR] Frontend directory not found!
    echo Please run this script from the project root directory.
    echo Expected structure: event creation\frontend\
    pause
    exit /b 1
)

echo [STEP 2] Project Structure Verification
echo Checking project structure...
if exist "frontend\package.json" (
    echo ✓ Frontend package.json found
) else (
    echo ✗ Frontend package.json missing
)

if exist "frontend\src\App.tsx" (
    echo ✓ App.tsx found
) else (
    echo ✗ App.tsx missing
)

if exist "frontend\public\index.html" (
    echo ✓ index.html found
) else (
    echo ✗ index.html missing
)
echo.

:: Check Node.js installation
echo [STEP 3] Node.js Environment Check
node --version >nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ Node.js is installed
    node --version
) else (
    echo ✗ Node.js is NOT installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

npm --version >nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ npm is available
    npm --version
) else (
    echo ✗ npm is NOT available
)
echo.

:: Check if dependencies are installed
echo [STEP 4] Dependencies Check
cd frontend
if exist "node_modules" (
    echo ✓ node_modules directory exists
) else (
    echo ✗ node_modules directory missing
    echo Installing dependencies...
    npm install
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to install dependencies
        pause
        exit /b 1
    )
)
echo.

:: Check package.json scripts
echo [STEP 5] Package.json Scripts Check
echo Available scripts:
type package.json | findstr "scripts" -A 10
echo.

:: Check for port conflicts
echo [STEP 6] Port Availability Check
echo Checking if port 3000 is available...
netstat -an | findstr ":3000" >nul
if %errorlevel% equ 0 (
    echo ⚠ Port 3000 is already in use!
    echo Processes using port 3000:
    netstat -ano | findstr ":3000"
    echo.
    echo You may need to:
    echo 1. Kill the process using port 3000
    echo 2. Use a different port
    echo 3. Check if another React app is running
) else (
    echo ✓ Port 3000 is available
)
echo.

:: Check Vite configuration
echo [STEP 7] Vite Configuration Check
if exist "vite.config.ts" (
    echo ✓ Vite config found
    echo Vite configuration:
    type vite.config.ts
) else (
    echo ✗ Vite config missing
)
echo.

:: Check for TypeScript configuration
echo [STEP 8] TypeScript Configuration Check
if exist "tsconfig.json" (
    echo ✓ TypeScript config found
) else (
    echo ✗ TypeScript config missing
)
echo.

:: Check for build errors
echo [STEP 9] Build Test
echo Testing build process...
npm run build >build_output.txt 2>&1
if %errorlevel% equ 0 (
    echo ✓ Build successful
) else (
    echo ✗ Build failed
    echo Build errors:
    type build_output.txt
)
echo.

:: Check for common React/Vite issues
echo [STEP 10] Common Issues Check
echo Checking for common problems...

:: Check if App.tsx has proper imports
findstr "import.*React" src\App.tsx >nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ React imports found in App.tsx
) else (
    echo ⚠ React imports might be missing in App.tsx
)

:: Check if index.tsx exists and has proper ReactDOM render
if exist "src\index.tsx" (
    echo ✓ index.tsx exists
    findstr "ReactDOM\|createRoot" src\index.tsx >nul 2>&1
    if %errorlevel% equ 0 (
        echo ✓ ReactDOM render found
    ) else (
        echo ⚠ ReactDOM render might be missing
    )
) else (
    echo ✗ index.tsx missing
)
echo.

:: Try to start the development server with detailed output
echo [STEP 11] Development Server Test
echo Attempting to start development server...
echo This will try to start the server and show any errors.
echo Press Ctrl+C to stop the server if it starts successfully.
echo.
echo Starting in 3 seconds...
timeout /t 3 >nul

:: Start the dev server with verbose output
npm run dev

:: If we reach here, the server stopped
echo.
echo [STEP 12] Diagnostic Summary
echo ========================================
echo If the server started successfully but you still get 404:
echo 1. Check if you're accessing the correct URL: http://localhost:3000
echo 2. Clear your browser cache
echo 3. Try a different browser
echo 4. Check browser console for JavaScript errors
echo.
echo If the server failed to start:
echo 1. Check the error messages above
echo 2. Ensure all dependencies are installed: npm install
echo 3. Check for port conflicts
echo 4. Verify Node.js version compatibility
echo.
echo Common solutions:
echo - Delete node_modules and package-lock.json, then run: npm install
echo - Update Node.js to latest LTS version
echo - Check firewall/antivirus blocking localhost
echo - Try running as administrator
echo ========================================

pause