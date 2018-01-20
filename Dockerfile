FROM ubuntu:16.04

MAINTAINER kutlak.roman@gmail.com

# Install required packages and remove the apt packages cache when done.

RUN apt-get update && \
    apt-get upgrade -y && \
    apt-get install -y \
	git \
	python3 \
	python3-dev \
	python3-setuptools \
	python3-pip \
	nginx \
	supervisor \
	sqlite3 \
	libmysqld-dev \
	libffi-dev \
	libssl-dev \
	libxml2-dev && \
	pip3 install -U pip setuptools && \
   rm -rf /var/lib/apt/lists/*

# install uwsgi now because it takes a little while
RUN pip3 install uwsgi

# setup all the configfiles
RUN echo "daemon off;" >> /etc/nginx/nginx.conf
COPY kutlak_net/nginx.conf /etc/nginx/sites-available/default
COPY kutlak_net/supervisor-website.conf /etc/supervisor/conf.d/

# COPY requirements.txt and RUN pip install BEFORE adding the rest of your code, this will cause Docker's caching mechanism
# to prevent re-installing (all your) dependencies when you made a change a line or two in your app.
RUN mkdir -p /opt/kutlak_net
RUN mkdir -p /var/log/kutlak_net

COPY requirements-live.txt /opt/kutlak_net
RUN pip3 install -r /opt/kutlak_net/requirements-live.txt

# add (the rest of) our code
COPY . /opt/kutlak_net

EXPOSE 80
#CMD ["supervisord", "-n"]
