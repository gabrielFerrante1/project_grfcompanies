# Generated by Django 3.2 on 2022-11-06 19:49

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0009_auto_20221106_1649'),
        ('companies', '0003_alter_employee_email'),
    ]

    operations = [
        migrations.DeleteModel(
            name='Employee',
        ),
    ]
