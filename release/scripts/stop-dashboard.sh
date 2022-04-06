#!/bin/bash
# innoAgent dashboard docker stop tools.
# Description: This tools will stopping existing innoAgent dashboard.
# Copyright: © 2022 - innodisk Corporation.

if [ "$(docker ps -a -q -f name=InnoAgent-Dashboard)" ]; then
    docker stop InnoAgent-Dashboard
else
    echo "innoAgent dashboard is not exist!"
fi