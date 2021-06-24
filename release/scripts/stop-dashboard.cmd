@echo off
cd .
rem innoAgent dashboard docker stop tools.
rem Description: This tools will stopping existing innoAgent dashboard.
rem Author: IPA -Jacky
rem Contact: jacky_sung@innodisk.com
rem Copyright: (c) 2021 - innodisk Corporation.

docker ps -a -q -f name=innoAgent-Dashboard >nul && docker stop innoAgent-Dashboard && echo innoAgent dashboard has been stopped! || echo innoAgent dashboard is not exist!