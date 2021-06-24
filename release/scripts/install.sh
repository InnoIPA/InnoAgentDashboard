#!/bin/bash
# innoAgent dashboard docker images build tools.
# Description: This program provides building innoAgent dashboard runtimes images.
# Author: IPA -Jacky
# Contact: jacky_sung@innodisk.com
# Copyright: (c) 2021 - innodisk Corporation.

# Show all innoAgent docker images.
echo -e "Show innoAgent container..."
echo "-------------------------------------------------------------------------------------------------------------------------------------------"

docker ps -q -f name=innoAgent

# New line
echo -e "\r\n"

# Clean old innoAgent dashboard images and container
echo -e "Warning: This process will forcibly delete existing innoAgent dashboard images, even if it is running, do you want to continue?\r"
read -n 1 -s -r -p "Press any key to continue..."

echo -e "Clean up old innoAgent dashboard...\r"

# Clean old innoAgent web service images.
if [ "$(docker ps -a -q -f name=innoAgent-Dashboard)" ]; then
    docker stop innoAgent-Dashboard
    docker rm innoAgent-Dashboard -f
fi

# Remove network
echo -e "Remove vitual network device...\r"
if [ "$(docker network ls | grep innoAgent_webservice_net)" ]; then
    docker network rm innoAgent_webservice_net
fi

# Remove images.
echo -e "Clean all innoAgent dashboard images...\r"
docker image inspect innoagent-dashboard:v1 >/dev/null 2>&1 && docker rmi innoagent-dashboard:v1 -f
docker image inspect nginx:latest >/dev/null 2>&1 && docker rmi nginx:latest -f

# Create new innoAgent web service images.
echo -e "Build new innoAgent dashboard and running...\r"
docker-compose -f ../docker-compose-dashboard.yml up -d

# Clean unnecessary images.
docker image inspect nginx:lts >/dev/null 2>&1 && docker rmi nginx:lts -f

echo "innoAgent dashboard is running!"
exit
