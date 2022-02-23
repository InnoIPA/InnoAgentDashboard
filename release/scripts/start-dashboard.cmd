@echo off
cd .
rem innoAgent dashboard docker start tools.
rem Description: This tools will start existing innoAgent dashboard.
rem Copyright: © 2022 - innodisk Corporation.

docker ps -a -q -f name=innoAgent-Dashboard >nul && docker start innoAgent-Dashboard && echo innoAgent dashboard has been started! || echo innoAgent dashboard is not exist!
