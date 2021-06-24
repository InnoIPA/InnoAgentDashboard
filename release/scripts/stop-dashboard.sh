#!/bin/bash
# innoAgent dashboard docker stop tools.
# Description: This tools will stopping existing innoAgent dashboard.
# Author: IPA -Jacky
# Contact: jacky_sung@innodisk.com
# Copyright: (c) 2021 - innodisk Corporation.

if [ "$(docker ps -a -q -f name=innoAgent-Dashboard)" ]; then
    docker stop innoAgent-Dashboard
else
    echo "innoAgent dashboard is not exist!"
fi