from django.db import models


class TemplateModel(models.Model):
    """TemplateModel stores templates used by the lexicaliser."""

    name = models.CharField(max_length=250)
    num_params = models.PositiveSmallIntegerField()  # max about 32k
    signature = models.CharField(max_length=256, blank=True)  # name/num_params
    description = models.CharField(max_length=1000, default='')
    content = models.TextField(max_length=64000, default='')  # sensible cap size

    class Meta:
        ordering = ['signature']

    def __init__(self, *args, **kwargs):
        super(TemplateModel, self).__init__(*args, **kwargs)
        self.signature = '{0}/{1}'.format(self.name, self.num_params)

    def __str__(self):
        return self.signature
