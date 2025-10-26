@echo off
echo ========================================
echo Basic Setup Test for PartyOria
echo ========================================
echo.

:: Navigate to frontend directory
cd frontend

echo [TEST 1] Checking Node.js and npm...
node --version
npm --version
echo.

echo [TEST 2] Installing dependencies (if needed)...
if not exist "node_modules" (
    npm install
)
echo.

echo [TEST 3] Quick dependency check...
npm list react react-dom vite --depth=0
echo.

echo [TEST 4] Starting development server...
echo.
echo If successful, you should see:
echo - "Local: http://localhost:3000/"
echo - "ready in XXXms"
echo.
echo The browser should automatically open to http://localhost:3000
echo If not, manually navigate to: http://localhost:3000
echo.
echo Press Ctrl+C to stop the server when done testing.
echo.

start "" "http://localhost:3000"
npm run dev