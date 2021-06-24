#!/bin/bash
# innoAgent dashboard docker image export tools.
# Description: This tools will save innoAgent dashboard docker images.
# Author: IPA -Jacky
# Contact: jacky_sung@innodisk.com
# Copyright: (c) 2021 - innodisk Corporation.

set -e
# Image export folder.
exportFolder="export-images"

# User interactive.
echo -e "This tool will export the docker image file of the innoAgent dashboard built on the current system and will overwrite the previously exported images."
echo -e "Are you sure to continue?"
read -n 1 -s -r -p "Press any key to continue..."

# Clean old image export folder.
echo -e "\r\nClean old export image files..."
if [ ! -d ${exportFolder} ]; then
    mkdir ${exportFolder}
else
    rm -rf ${exportFolder}/innoAgent-Dashboard.tar
fi

# Export new built images.
echo -e "Export new image files..."
docker image inspect innoagent-dashboard:v1 >/dev/null 2>&1 && docker save -o ${exportFolder}/innoAgent-Dashboard.tar innoagent-dashboard:v1 || echo "innoAgent dashboard images is not exist!"

echo -e "Export process done!"
