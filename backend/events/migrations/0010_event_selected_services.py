# Generated migration for selected_services field

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('events', '0009_event_special_requirements'),
    ]

    operations = [
        migrations.AddField(
            model_name='event',
            name='selected_services',
            field=models.JSONField(blank=True, default=list),
        ),
    ]