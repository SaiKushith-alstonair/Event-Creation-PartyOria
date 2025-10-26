@echo off
echo Starting PartyOria Frontend Development Server...
echo.

cd /d "%~dp0"

echo Checking Node.js installation...
node --version
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH
    pause
    exit /b 1
)

echo.
echo Checking npm installation...
npm --version
if %errorlevel% neq 0 (
    echo ERROR: npm is not installed or not in PATH
    pause
    exit /b 1
)

echo.
echo Installing dependencies...
npm install

echo.
echo Starting development server on port 3000...
echo If port 3000 is busy, the server will try alternative ports.
echo.
echo The server will automatically open in your browser.
echo If it doesn't open, manually navigate to: http://localhost:3000
echo.

npm run dev

pause