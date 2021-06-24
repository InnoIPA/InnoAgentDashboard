@echo off
cd .
rem innoAgent dashboard docker image build tools.
rem Description: This tools will build innoAgent dashboard docker images.
rem Author: IPA -Jacky
rem Contact: jacky_sung@innodisk.com
rem Copyright: (c) 2021 - innodisk Corporation.

title innoAgentnt dashboard docker image build tools for Windows OS
echo Building innoAgent dashboard images...
copy "..\nginx.conf" "..\innoAgent-dashboard" /y
docker image inspect innoagent-dashboard:v1 >nul && docker rmi innoagent-dashboard:v1
docker build -f ..\DockerFile-manual -t innoagent-dashboard:v1 ..\innoAgent-dashboard
del "..\innoAgent-dashboard\nginx.conf" /f


rem Clean unnecessary images.
echo.
echo Cleaning...
docker image inspect nginx:latest >nul && docker rmi nginx:latest -f
echo.
echo innoAgent dashboard image has been built!