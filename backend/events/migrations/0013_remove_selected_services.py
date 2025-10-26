# Generated migration to remove selected_services field

from django.db import migrations

class Migration(migrations.Migration):

    dependencies = [
        ('events', '0012_update_special_requirements_structure'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='event',
            name='selected_services',
        ),
    ]