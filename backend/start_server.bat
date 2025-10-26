@echo off
echo Starting PartyOria Backend Server...
echo.

echo Installing dependencies...
pip install -r requirements.txt

echo.
echo Creating database migrations...
python manage.py makemigrations

echo.
echo Applying migrations...
python manage.py migrate

echo.
echo Populating sample vendors...
python populate_vendors.py

echo.
echo Creating superuser (optional)...
echo Username: admin
echo Email: admin@partyoria.com
echo Password: admin123
echo from django.contrib.auth.models import User; User.objects.create_superuser('admin', 'admin@partyoria.com', 'admin123') if not User.objects.filter(username='admin').exists() else None | python manage.py shell

echo.
echo Starting development server...
echo Backend will be available at: http://localhost:8000
echo Admin panel at: http://localhost:8000/admin
echo API endpoints at: http://localhost:8000/api
echo.
python manage.py runserver