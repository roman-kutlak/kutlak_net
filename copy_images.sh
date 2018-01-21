#!/usr/bin/env bash

. /Users/roman/.virtualenvs/kutlak_net/bin/activate

docker save -o /tmp/website.docker kutlaknet_website:latest
docker save -o /tmp/nginx.docker kutlaknet_nginx:latest

scp /tmp/website.docker www.kutlak.info:~/
scp /tmp/nginx.docker www.kutlak.info:~/
