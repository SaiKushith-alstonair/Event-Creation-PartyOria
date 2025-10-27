# Generated migration to restore HeroVideo model and add new video

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('events', '0026_remove_herovideo'),
    ]

    operations = [
        migrations.CreateModel(
            name='HeroVideo',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=200)),
                ('video_url', models.URLField(max_length=500)),
                ('is_active', models.BooleanField(default=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
            options={
                'db_table': 'hero_videos',
            },
        ),
        migrations.RunSQL(
            "INSERT INTO hero_videos (name, video_url, is_active, created_at) VALUES ('PartyOria New Video', '/videos/partyoria-bg.mp4', TRUE, NOW());",
            reverse_sql="DELETE FROM hero_videos WHERE name = 'PartyOria New Video';"
        ),
    ]