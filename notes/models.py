from django.db import models


class Tag(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name

    def __repr__(self):
        return '<Tag "{}">'.format(str(self))


class Note(models.Model):
    title = models.CharField(max_length=255)
    body = models.TextField()
    published = models.DateTimeField()
    updated = models.DateTimeField
    tags = models.ManyToManyField(Tag, related_name='tags')

    def __str__(self):
        return self.title

    def __repr__(self):
        return '<Note "{}">'.format(str(self))

