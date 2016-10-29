from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^$', views.homepage, name='socrates.homepage'),
    url(r'^demo/$', views.demo, name='socrates.demo'),
    url(r'^graph/$', views.Graph.as_view(), name='socrates.graph'),
    url(r'^command/$', views.process_command, name='socrates.command'),
    url(r'^load-kb/$', views.load_kb, name='socrates.load-kb'),
]
