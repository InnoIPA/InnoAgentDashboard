@echo off
cd .
rem innoAgent dashboard docker image export tools.
rem Description: This tools will save innoAgent dashboard docker images.
rem Copyright: © 2022 - innodisk Corporation.


title innoAgent dashboard docker image export tools for Windows OS
set exportFolder=export-images

rem User interactive.
echo This tool will export the Docker image file of the innoAgent dashboard built on the current system and will overwrite the previously exported images.
echo Are you sure to continue?
echo.
echo Press any key to continue...
pause>nul

rem Clean old image export folder.
echo Clean old export image files...
if not exist %exportFolder% (
    mkdir %exportFolder%
) else (
    del %exportFolder%\innoAgent-Dashboard.tar /f
)

rem  Export new built images.
echo.
echo Export new image files...
docker image inspect innoagent-dashboard:v1 >nul && docker save -o %exportFolder%\innoAgent-Dashboard.tar innoagent-dashboard:v1 || echo innoAgent dashboard images is not exist!
echo.
echo Export process done!