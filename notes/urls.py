from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^$', views.homepage, name='notes.homepage'),
    url(r'^list/$', views.NotesView.as_view(), name='notes.list'),
    url(r'^tag/(?P<tag>(.+))$', views.NotesTaggedView.as_view(), name='notes.tagged'),
]
