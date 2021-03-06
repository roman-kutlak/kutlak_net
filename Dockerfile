FROM gliderlabs/alpine:3.6

RUN apk add --no-cache python3 python3-dev uwsgi uwsgi-python3 git
RUN pip3 install virtualenv

WORKDIR /opt/kutlak_net
COPY requirements-live.txt /opt/kutlak_net

RUN virtualenv -p `which python3` /opt/virtualenv && \
    /opt/virtualenv/bin/pip install -r /opt/kutlak_net/requirements-live.txt

COPY . /opt/kutlak_net

CMD uwsgi --ini /opt/kutlak_net/kutlak_net/uwsgi.ini

EXPOSE 8000
