from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^$', views.homepage, name='socrates.homepage'),
    url(r'^demo/$', views.demo, name='socrates.demo'),
    url(r'^graph/$', views.Graph.as_view(), name='socrates.graph')
]
