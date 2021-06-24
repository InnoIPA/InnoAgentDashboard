#!/bin/bash
# innoAgent dashboard docker start tools.
# Description: This tools will start existing innoAgent dashboard.
# Author: IPA -Jacky
# Contact: jacky_sung@innodisk.com
# Copyright: (c) 2021 - innodisk Corporation.

if [ "$(docker ps -a -q -f name=innoAgent-Dashboard)" ]; then
    docker start innoAgent-Dashboard
else

    echo "innoAgent web dashboard is not exist!"
fi