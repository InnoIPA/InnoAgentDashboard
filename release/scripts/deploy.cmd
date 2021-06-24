@echo off
cd .
rem innoAgent dashboard image manual deploy tools.
rem Description: This tools will create virtual network device and container to start innoAgent dashboard docker images.
rem Author: IPA -Jacky
rem Contact: jacky_sung@innodisk.com
rem Copyright: (c) 2021 - innodisk Corporation.

title innoAgent dashboard docker image manual start tools for Windows OS
set exportFolder=export-images

echo Loading docker images...
rem Check if the innoAgent dashboard docker images is existing...


if exist %exportFolder%\innoAgent-Dashboard.tar (
    docker load -i %exportFolder%\innoAgent-Dashboard.tar
    goto :createNetwoark
)


:createNetwoark
docker network ls | findstr innoagent_webservice_net && docker network rm innoAgent_webservice_net && docker network create --driver=bridge --subnet=172.99.0.0/16 innoagent_webservice_net || docker network create --driver=bridge --subnet=172.99.0.0/16 innoagent_webservice_net
goto :runContainer

:runContainer
docker image inspect innoagent-dashboard:v1 >nul && docker run -idt -p 80:80 --network=innoagent_webservice_net --ip 172.99.0.102 --restart always --name innoAgent-Dashboard innoagent-dashboard:v1
echo innoAgent dashboard is running!