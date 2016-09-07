from django.conf.urls import url

from snappy import views


urlpatterns = [
    url(r'^$', views.homepage, name='snappy.homepage'),
    url(r'^demo/$', views.demo, name='snappy.demo'),
    url(r'^translate/$', views.translate, name='snappy.translate'),
    url(r'^templates/$', views.TemplateListView.as_view(), name='snappy.templates-list'),
    url(r'^template/(?P<pk>\d+)$', views.TemplateDetailView.as_view(), name='snappy.templates-detail'),
]
