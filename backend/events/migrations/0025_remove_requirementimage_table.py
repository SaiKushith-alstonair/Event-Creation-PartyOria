from django.db import migrations

class Migration(migrations.Migration):
    dependencies = [
        ('events', '0024_eventrequirementimages'),
    ]

    operations = [
        migrations.RunSQL(
            "DROP TABLE IF EXISTS requirement_images;",
            reverse_sql="CREATE TABLE requirement_images (id INTEGER PRIMARY KEY, requirement_id VARCHAR(100), image_url VARCHAR(1000), order_field INTEGER DEFAULT 0, created_at DATETIME);"
        ),
    ]