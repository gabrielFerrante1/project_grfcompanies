# Generated by Django 3.2 on 2023-08-21 19:39

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('companies', '0008_task_taskstatus'),
    ]

    operations = [
        migrations.RenameField(
            model_name='task',
            old_name='body',
            new_name='description',
        ),
    ]
