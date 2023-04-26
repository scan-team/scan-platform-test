#!/bin/bash

# =================================================================================================
# Project: SCAN - Searching Chemical Actions and Networks
#          Hokkaido University (2021)
#          Last Update: Q2 2023
# ________________________________________________________________________________________________
# Authors: Mikael Nicander Kuwahara (Lead Developer) [2022-]
#          Jun Fujima (Former Lead Developer) [2021]
#          NorthGrid (Support Dev)
# ________________________________________________________________________________________________
# Description: This is the file that starts the running docker-compose for the total project in a 
#              proper and safe manner, when running in dev mode, which updates all saved changes 
#              automatically to the browser without the need for restart.
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

# Pre-build the dev docker containers
./build-dev.sh

# Call Docker Compose Dev and ask it to build and activate all related docker containers
docker-compose -f docker-compose-dev.yml up -d
