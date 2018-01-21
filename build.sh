#!/usr/bin/env bash

. /Users/roman/.virtualenvs/kutlak_net/bin/activate
eval $(aws ecr get-login --no-include-email --region eu-west-1)

docker-compose build

docker tag kutlaknet_website:latest 020566432020.dkr.ecr.eu-west-1.amazonaws.com/kutlak-net:website
docker tag kutlaknet_nginx:latest 020566432020.dkr.ecr.eu-west-1.amazonaws.com/kutlak-net:nginx

docker push 020566432020.dkr.ecr.eu-west-1.amazonaws.com/kutlak-net:website
docker push 020566432020.dkr.ecr.eu-west-1.amazonaws.com/kutlak-net:nginx

