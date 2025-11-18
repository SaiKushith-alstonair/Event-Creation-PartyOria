from django.db import migrations

class Migration(migrations.Migration):
    dependencies = [
        ('authentication', '0001_initial'),
    ]

    operations = [
        migrations.RunSQL(
            "ALTER TABLE authentication_customuser DROP COLUMN IF EXISTS full_name;",
            reverse_sql="ALTER TABLE authentication_customuser ADD COLUMN full_name VARCHAR(255);"
        ),
        migrations.RunSQL(
            "ALTER TABLE authentication_customuser DROP COLUMN IF EXISTS mobile;",
            reverse_sql="ALTER TABLE authentication_customuser ADD COLUMN mobile VARCHAR(15);"
        ),
        migrations.RunSQL(
            "ALTER TABLE authentication_customuser DROP COLUMN IF EXISTS business;",
            reverse_sql="ALTER TABLE authentication_customuser ADD COLUMN business VARCHAR(50);"
        ),
        migrations.RunSQL(
            "ALTER TABLE authentication_customuser DROP COLUMN IF EXISTS experience_level;",
            reverse_sql="ALTER TABLE authentication_customuser ADD COLUMN experience_level VARCHAR(20);"
        ),
        migrations.RunSQL(
            "ALTER TABLE authentication_customuser DROP COLUMN IF EXISTS is_online;",
            reverse_sql="ALTER TABLE authentication_customuser ADD COLUMN is_online BOOLEAN DEFAULT FALSE;"
        ),
        migrations.RunSQL(
            "ALTER TABLE authentication_customuser DROP COLUMN IF EXISTS location;",
            reverse_sql="ALTER TABLE authentication_customuser ADD COLUMN location VARCHAR(255);"
        ),
        migrations.RunSQL(
            "ALTER TABLE authentication_customuser DROP COLUMN IF EXISTS city;",
            reverse_sql="ALTER TABLE authentication_customuser ADD COLUMN city VARCHAR(100);"
        ),
        migrations.RunSQL(
            "ALTER TABLE authentication_customuser DROP COLUMN IF EXISTS state;",
            reverse_sql="ALTER TABLE authentication_customuser ADD COLUMN state VARCHAR(100);"
        ),
        migrations.RunSQL(
            "ALTER TABLE authentication_customuser DROP COLUMN IF EXISTS pincode;",
            reverse_sql="ALTER TABLE authentication_customuser ADD COLUMN pincode VARCHAR(10);"
        ),
    ]