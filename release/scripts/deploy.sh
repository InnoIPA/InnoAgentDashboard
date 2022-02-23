#!/bin/bash
# innoAgent dashboard image manual deploy tools.
# Description: This tools will create virtual network device and container to start innoAgent dashboard docker images.
# Copyright: © 2022 - innodisk Corporation.

set -e
# Image export folder.
exportFolder="export-images"

echo -e "Loading docker images..."

# Check if the innoAgent dashboard docker images is existing...
if [ -f "${exportFolder}/innoAgent-Dashboard.tar" ]; then
    docker load -i ${exportFolder}/innoAgent-Dashboard.tar

    echo -e "Create virtual network devices...\r"

    if [ ! "$(docker network ls | grep innoAgent_webservice_net)" ]; then
        docker network create --driver=bridge --subnet=172.99.0.0/16 innoagent_webservice_net
    fi

    echo "Import images to container and start innoAgent dashboard..."
    docker image inspect innoagent-dashboard:v1 >/dev/null 2>&1 && docker run -idt -p 80:80 --network=innoagent_webservice_net --ip 172.99.0.102 --restart always --name innoAgent-Dashboard innoagent-dashboard:v1 || echo ""
    echo "innoAgent dashboard is started!"
else
    echo -e "Error! innoAgent dashboard docker images is not existing!\r\nClose!"
fi
