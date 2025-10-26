@echo off
echo Setting up event system database...

echo Running migrations...
python manage.py makemigrations
python manage.py migrate

echo Populating event data...
python manage.py populate_event_data

echo Populating images and requirements...
python manage.py populate_images_requirements

echo Event system setup complete!
pause