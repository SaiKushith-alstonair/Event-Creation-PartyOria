@echo off
echo Setting up PostgreSQL database for PartyOria...
echo.

REM Install requirements
echo Installing Python dependencies...
pip install -r requirements.txt

echo.
echo Creating PostgreSQL database...
python setup_postgres.py

echo.
echo Running Django migrations...
python manage.py makemigrations
python manage.py migrate

echo.
echo Database setup complete!
echo You can now run: python manage.py runserver
pause