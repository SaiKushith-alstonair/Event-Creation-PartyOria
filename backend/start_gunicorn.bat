@echo off
echo Starting Django with Gunicorn for faster performance...
cd /d "%~dp0"
gunicorn partyoria.wsgi:application --bind 0.0.0.0:8000 --workers 4 --reload --timeout 120
pause