FROM nginx
RUN rm /etc/nginx/conf.d/default.conf
ADD ./config/docker/nginx/conf.d /etc/nginx/conf.d/
RUN mkdir -p /opt/nwpe
ADD . /opt/nwpe/
