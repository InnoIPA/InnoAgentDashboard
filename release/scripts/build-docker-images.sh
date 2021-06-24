#!/bin/bash
# innoAgent dashboard docker image build tools.
# Description: This tools will build innoAgent dashboard docker images.
# Author: IPA -Jacky
# Contact: jacky_sung@innodisk.com
# Copyright: (c) 2021 - innodisk Corporation.

echo "Building innoAgent dashboard images..."
cp "../nginx.conf" "../innoAgent-dashboard"
docker image inspect innoagent-dashboard:v1 >/dev/null 2>&1 docker rmi innoagent-dashboard:v1
docker build -f ../DockerFile-manual -t innoagent-dashboard:v1 ../innoAgent-dashboard
rm -rf "../innoAgent-dashboard/nginx.conf"