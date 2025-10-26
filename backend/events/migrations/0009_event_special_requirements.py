# Generated migration for special_requirements field
# Generated migration for special_requirements field

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('events', '0008_traditionstyle'),
    ]

    operations = [
        migrations.AddField(
            model_name='event',
            name='special_requirements',
            field=models.JSONField(blank=True, default=dict),
        ),
    ]