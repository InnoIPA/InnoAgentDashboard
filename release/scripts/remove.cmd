@echo off
cd .
rem innoAgent dashboard docker stop and remove tools.
rem Description: This tools wii stopping and remove existing innoAgent dashboard.
rem Copyright: © 2022 - innodisk Corporation.

title innoAgent dashboard remove tools for Windows OS

rem Clean old innoAgent dashboard images.
echo Stop and remove existing dashboard...
docker ps -a -q -f name=InnoAgent-Dashboard >nul && docker stop InnoAgent-Dashboard && echo. && docker rm InnoAgent-Dashboard -f || echo InnoAgent dashboard is not exist!


rem Remove vitual network device.
echo.
echo Remove vitual network device...
docker network ls -q -f name=innoagent_webservice_net && docker network rm innoagent_webservice_net

rem Remove images.
echo.
echo Clean all innoAgent dashboard images...
docker image inspect innoagent-dashboard:v1 >nul && docker rmi innoagent-dashboard:v1 -f
docker image inspect nginx:latest >nul && docker rmi nginx:latest -f

echo innoAgent dashboard has been removed!