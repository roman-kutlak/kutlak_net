# -*- coding: utf-8 -*-
# Generated by Django 1.10 on 2016-09-13 15:52
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('notes', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Tag',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
            ],
        ),
        migrations.AddField(
            model_name='note',
            name='tags',
            field=models.ManyToManyField(related_name='tags', to='notes.Tag'),
        ),
    ]
