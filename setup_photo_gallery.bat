@echo off
echo Setting up comprehensive photo gallery system...

cd backend

echo.
echo Step 1: Populating photo gallery images...
python manage.py populate_comprehensive_photo_gallery

echo.
echo Step 2: Updating photo gallery requirements...
python manage.py update_photo_gallery_requirements

echo.
echo Photo gallery setup completed successfully!
echo.
echo Photo gallery features added:
echo - 3+ sample images for each visual requirement
echo - Photo gallery style preferences
echo - Digital delivery options
echo - Professional photo management
echo.
pause