@echo off
echo Migrating RequirementImage data to EventRequirementImages...

cd backend

echo.
echo Step 1: Migrating existing data...
python manage.py migrate_requirement_images

echo.
echo Step 2: Running database migration...
python manage.py migrate

echo.
echo Step 3: Populating new photo gallery...
python manage.py populate_comprehensive_photo_gallery

echo.
echo Migration completed successfully!
echo - Data moved from RequirementImage to EventRequirementImages
echo - RequirementImage table removed
echo - New photo gallery populated
echo.
pause