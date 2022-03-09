#!/bin/bash
# innoAgent dashboard docker stop and remove tools.
# Description: This tools wii stopping and remove existing innoAgent dashboard.
# Copyright: © 2022 - innodisk Corporation.

set -e
# Clean old innoAgent dashboard images.
echo -e "Stop and remove existing dashboard...\r"
if [ "$(docker ps -a -q -f name=InnoAgent-Dashboard)" ]; then
    docker stop InnoAgent-Dashboard
    docker rm InnoAgent-Dashboard -f
fi

# Remove network
echo -e "\rRemove vitual network device...\r"
if [ "$(docker network ls | grep innoagent_webservice_net)" ]; then
    docker network rm innoagent_webservice_net
fi

# Remove images.
echo -e "\rClean all innoAgent dashboard images...\r"
docker image inspect innoagent-dashboard:v1 >/dev/null 2>&1 && docker rmi innoagent-dashboard:v1 -f || echo ""
docker image inspect nginx:latest >/dev/null 2>&1 && docker rmi nginx:latest -f || echo ""

echo -e "\rinnoAgent dashboard has been removed!"
exit
