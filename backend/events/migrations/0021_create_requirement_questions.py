from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('events', '0019_herovideo'),
    ]

    operations = [
        migrations.CreateModel(
            name='RequirementQuestion',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('question_text', models.CharField(max_length=255)),
                ('question_type', models.CharField(
                    choices=[
                        ('text', 'Text Input'),
                        ('number', 'Number Input'),
                        ('dropdown', 'Dropdown'),
                        ('checkbox', 'Checkbox'),
                        ('radio', 'Radio Button')
                    ],
                    default='text',
                    max_length=20
                )),
                ('options', models.JSONField(blank=True, null=True, help_text='Options for dropdown/radio/checkbox')),
                ('placeholder', models.CharField(blank=True, max_length=100)),
                ('min_value', models.IntegerField(blank=True, null=True)),
                ('max_value', models.IntegerField(blank=True, null=True)),
                ('is_required', models.BooleanField(default=False)),
                ('order', models.IntegerField(default=0)),
                ('requirement', models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE,
                    related_name='questions',
                    to='events.eventrequirement'
                )),
            ],
            options={
                'ordering': ['order', 'id'],
            },
        ),
    ]