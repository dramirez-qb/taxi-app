# -*- coding: utf-8 -*-
# Generated by Django 1.11 on 2017-05-27 18:34
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Trip',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nk', models.CharField(db_index=True, max_length=32, unique=True)),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('updated', models.DateTimeField(auto_now=True)),
                ('pick_up_address', models.CharField(max_length=255)),
                ('drop_off_address', models.CharField(max_length=255)),
                ('status', models.CharField(choices=[('REQUESTED', 'REQUESTED'), ('STARTED', 'STARTED'), ('IN_PROGRESS', 'IN_PROGRESS'), ('COMPLETED', 'COMPLETED')], default='REQUESTED', max_length=20)),
            ],
        ),
    ]
