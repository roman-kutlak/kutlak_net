FROM nginx
RUN rm /etc/nginx/conf.d/default.conf
COPY ./uwsgi_params /opt/uwsgi_params
ADD ./conf.d /etc/nginx/conf.d/
ADD ./_static /usr/share/nginx/html
