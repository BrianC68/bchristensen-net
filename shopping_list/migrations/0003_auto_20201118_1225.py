# Generated by Django 3.1.2 on 2020-11-18 18:25

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('shopping_list', '0002_auto_20201103_0827'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='shoppinglistitem',
            options={'ordering': ['department']},
        ),
    ]
