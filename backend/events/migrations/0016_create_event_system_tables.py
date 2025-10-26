from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('events', '0015_event_selected_services'),
    ]

    operations = [
        migrations.CreateModel(
            name='EventSection',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('section_id', models.CharField(max_length=50, unique=True)),
                ('name', models.CharField(max_length=200)),
                ('icon', models.CharField(max_length=50)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
            options={
                'db_table': 'event_sections',
            },
        ),
        migrations.CreateModel(
            name='EventSubsection',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('subsection_id', models.CharField(max_length=50)),
                ('name', models.CharField(max_length=200)),
                ('section', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='subsections', to='events.eventsection')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
            options={
                'db_table': 'event_subsections',
            },
        ),
        migrations.CreateModel(
            name='EventImage',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('event_id', models.CharField(max_length=100, unique=True)),
                ('image_url', models.URLField()),
                ('description', models.TextField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
            options={
                'db_table': 'event_images',
            },
        ),
        migrations.CreateModel(
            name='EventRequirement',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('event_id', models.CharField(max_length=100)),
                ('category_name', models.CharField(max_length=200)),
                ('requirement_id', models.CharField(max_length=100)),
                ('label', models.CharField(max_length=200)),
                ('category', models.CharField(max_length=50)),
                ('unit', models.CharField(max_length=50, blank=True, null=True)),
                ('placeholder', models.CharField(max_length=200, blank=True, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
            options={
                'db_table': 'event_requirements',
            },
        ),
        migrations.CreateModel(
            name='VendorCategory',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('category_id', models.CharField(max_length=50, unique=True)),
                ('name', models.CharField(max_length=200)),
                ('vendors', models.JSONField(default=list)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
            options={
                'db_table': 'vendor_categories',
            },
        ),
        migrations.AddIndex(
            model_name='eventsubsection',
            index=models.Index(fields=['subsection_id'], name='events_eventsubsection_subsection_id_idx'),
        ),
        migrations.AddIndex(
            model_name='eventsection',
            index=models.Index(fields=['section_id'], name='events_eventsection_section_id_idx'),
        ),
        migrations.AddIndex(
            model_name='eventimage',
            index=models.Index(fields=['event_id'], name='events_eventimage_event_id_idx'),
        ),
        migrations.AddIndex(
            model_name='eventrequirement',
            index=models.Index(fields=['event_id'], name='events_eventrequirement_event_id_idx'),
        ),
    ]