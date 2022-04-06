@echo off
cd .
rem innoAgent dashboard docker start tools.
rem Description: This tools will start existing innoAgent dashboard.
rem Copyright: © 2022 - innodisk Corporation.

docker ps -a -q -f name=InnoAgent-Dashboard >nul && docker start InnoAgent-Dashboard && echo innoAgent dashboard has been started! || echo innoAgent dashboard is not exist!
