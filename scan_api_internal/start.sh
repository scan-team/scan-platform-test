#!/bin/bash

# =================================================================================================
# Project: SCAN - Searching Chemical Actions and Networks
#          Hokkaido University (2021)
#          Last Update: Q2 2023
# ________________________________________________________________________________________________
# Authors: Mikael Nicander Kuwahara (Lead Developer) [2022-]
#          Jun Fujima (Former Lead Developer) [2021]
# ________________________________________________________________________________________________
# Description: This is the start.sh bash file that starts the running docker-compose for the 
#              scan-api-internal part of the project in a proper and safe manner.
# ------------------------------------------------------------------------------------------------
# Notes: You only need to use this if you ever wish to run this part of SCAN on its own.
# ------------------------------------------------------------------------------------------------
# References: 
# =================================================================================================


# Make sure the script exits if anything goes wrong
set -euxo pipefail

# Call Docker Compose and ask it to build and activate all related docker containers
docker-compose up -d --build
