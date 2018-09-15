from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('example', '0003_auto_20180221_0208'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='photo',
            field=models.ImageField(blank=True, null=True, upload_to='photos'),
        ),
    ]
