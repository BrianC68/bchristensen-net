from .base import *
import os

DEBUG = False
SECRET_KEY = os.getenv('SECRET_KEY')
ALLOWED_HOSTS = ['bchristensen.net']

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'bchristensen$bcnet',
        'USER': 'bchristensen',
        'PASSWORD': os.getenv('DB_PASSWORD'),
        'HOST': 'bchristensen.mysql.pythonanywhere-services.com',
        # 'PORT': '3306',
        'OPTIONS': {
            'init_command': 'SET sql_mode="STRICT_TRANS_TABLES"'
        }
    }
}


try:
    from .local import *
except ImportError:
    pass
