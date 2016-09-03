from django.db import models


class Note(models.Model):
    title = models.CharField(max_length=255)
    body = models.TextField()
    published = models.DateTimeField()
    updated = models.DateTimeField
