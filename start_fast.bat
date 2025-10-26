@echo off
echo Starting PartyOria with Performance Optimizations...

echo.
echo [1/2] Starting Django Backend with Gunicorn...
cd backend
start "Django Backend" cmd /k "gunicorn partyoria.wsgi:application --bind 0.0.0.0:8000 --workers 4 --reload --timeout 120"

echo.
echo [2/2] Starting React Frontend with Vite...
cd ../frontend
start "React Frontend" cmd /k "npm run dev"

echo.
echo ✅ Both servers are starting...
echo 🚀 Backend: http://localhost:8000
echo 🌐 Frontend: http://localhost:5173
echo.
echo Press any key to exit...
pause > nul