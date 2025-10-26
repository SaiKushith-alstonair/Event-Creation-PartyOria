# Generated migration to remove HeroVideo model

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('events', '0025_remove_requirementimage_table'),
    ]

    operations = [
        migrations.RunSQL(
            "DROP TABLE IF EXISTS hero_videos;",
            reverse_sql="CREATE TABLE hero_videos (id BIGINT PRIMARY KEY, name VARCHAR(200), video_url VARCHAR(500), is_active BOOLEAN DEFAULT TRUE, created_at TIMESTAMP);"
        ),
    ]