FROM gliderlabs/alpine:3.6

RUN apk add --no-cache python3 python3-dev uwsgi uwsgi-python3
RUN pip3 install virtualenv

WORKDIR /opt/kutlak_net
COPY requirements-live.txt /opt/kutlak_net
COPY config /opt/kutlak_net/config

RUN virtualenv /env && /env/bin/pip install -r /opt/kutlak_net/requirements-live.txt

CMD if test ! -e /edit_api/logs/; then mkdir -p /edit_api/logs/; fi && uwsgi --ini /opt/kutlak_net/config/uwsgi.ini

EXPOSE 8000
