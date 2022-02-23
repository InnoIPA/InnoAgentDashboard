@echo off
cd .
rem innoAgent dashboard docker images build tools.
rem Description: This program provides building innoAgent dashboard runtimes images.
rem Copyright: © 2022 - innodisk Corporation.

rem how all docker images.
echo Show all docker container...
echo -------------------------------------------------------------------------------------------------------------------------------------------

docker ps -a -f name="innoAgent"

rem Clean old innoAgent dashboard images and container
echo.
echo Warning: This process will forcibly delete existing innoAgent dashboard images, even if it is running, do you want to continue?
echo.
echo Press any key to continue...
pause>nul


echo Clean up old innoAgent dashboard...

rem Clean old innoAgent dashboard images.
echo.
echo Stop and remove exist dashboard...
docker ps -a -q -f name=innoAgent-Dashboard >nul && docker stop innoAgent-Dashboard && echo innoAgent dashboard has been stopped! || echo innoAgent dashboard is not exist!


rem Remove vitual network device.
echo.
echo Remove vitual network device...
docker network ls | findstr innoAgent_webservice_net && docker network rm innoAgent_webservice_net

rem Remove images.
echo.
echo Clean all innoAgent dashboard images...
docker image inspect innoagent-dashboard:v1 >nul && docker rmi innoagent-dashboard:v1 -f
docker image inspect nginx:latest >nul && docker rmi nginx:latest -f

rem Create new innoAgent dashboard images.
echo.
echo Build new innoAgent dashboard images and running...
docker-compose -f ../docker-compose-dashboard.yml up -d

rem Clean unnecessary images.
echo.
echo Cleaning...
docker image inspect nginx:latest >nul && docker rmi nginx:latest -f

echo innoAgent dashboard is running!




