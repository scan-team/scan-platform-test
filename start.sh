#!/bin/bash

# =================================================================================================
# Project: SCAN - Searching Chemical Actions and Networks
#          Hokkaido University (2021)
#          Last Update: Q2 2023
# ________________________________________________________________________________________________
# Authors: Mikael Nicander Kuwahara (Lead Developer) [2022-]
#          Jun Fujima (Former Lead Developer) [2021]
# ________________________________________________________________________________________________
# Description: This is the file that starts the running docker-compose for the total 
#              project in a proper and safe manner.
# ------------------------------------------------------------------------------------------------
# Notes: 
# ------------------------------------------------------------------------------------------------
# References: 
# =================================================================================================


# Make sure the script exits if anything goes wrong
set -euxo pipefail

# Pass the current user- and group- id into docker-compose.yml
export USERID=$(id -u)
export GROUPID=$(id -g)

# Make sure all writing rights are proper
chmod a+w scan-reverse-proxy/log
chmod a+w scan_data_observer/data
chmod a+w scan_data_observer/logs

# Make sure to pre-build the docker containers with build.sh if it exists
if test -f "build.sh"; then
    ./build.sh
fi

# Call Docker Compose and ask it to build and activate all related docker containers
docker-compose up -d 
