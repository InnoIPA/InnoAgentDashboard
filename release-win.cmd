@echo off
cd .
title innoAgentWebAppDemo Deploy tools for Windows OS

rem Checking node_module folder...
echo Checking node_module folder...
if not exist node_modules (
echo node_modules folder not exist, now installing!
call npm install
)

rem Do webpack...
echo Building...
call npm run build

rem Do release process
echo Do release process...
xcopy dist release\innoAgent-dashboard /E /K /Y

rem delay 10 sec.
ping 127.0.0.1 -n 10 -w 1000 > nul
echo Done!
echo Press any key to exit.
pause>nul