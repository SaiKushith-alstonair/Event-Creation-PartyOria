@echo off
echo PartyOria Frontend Troubleshooting Script
echo ========================================
echo.

cd /d "%~dp0"

echo 1. Checking Node.js and npm versions...
echo Node.js version:
node --version
echo npm version:
npm --version
echo.

echo 2. Checking if port 3000 is available...
netstat -an | findstr :3000
if %errorlevel% equ 0 (
    echo WARNING: Port 3000 is already in use!
    echo You may need to stop other applications using this port.
) else (
    echo Port 3000 is available.
)
echo.

echo 3. Checking if port 5173 is available...
netstat -an | findstr :5173
if %errorlevel% equ 0 (
    echo WARNING: Port 5173 is already in use!
) else (
    echo Port 5173 is available.
)
echo.

echo 4. Checking project structure...
if exist "package.json" (
    echo ✓ package.json found
) else (
    echo ✗ package.json NOT found - you may be in the wrong directory
)

if exist "src\index.tsx" (
    echo ✓ src\index.tsx found
) else (
    echo ✗ src\index.tsx NOT found
)

if exist "public\index.html" (
    echo ✓ public\index.html found
) else (
    echo ✗ public\index.html NOT found
)

if exist "node_modules" (
    echo ✓ node_modules directory found
) else (
    echo ✗ node_modules NOT found - run 'npm install'
)
echo.

echo 5. Checking for common issues...
if exist "package-lock.json" (
    echo ✓ package-lock.json exists
) else (
    echo ! package-lock.json missing - this is usually fine
)

echo.
echo 6. Suggested solutions:
echo - If port 3000 is busy, try: npm run dev-alt
echo - If dependencies are missing, run: npm install
echo - If still having issues, try: npm run dev-host
echo.

pause