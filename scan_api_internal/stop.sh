#!/bin/bash

# =================================================================================================
# Project: SCAN - Searching Chemical Actions and Networks
#          Hokkaido University (2021)
# ________________________________________________________________________________________________
# Authors: Jun Fujima (Former Lead Developer) [2021]
#          Mikael Nicander Kuwahara (Current Lead Developer) [2022-]
# ________________________________________________________________________________________________
# Description: This is the stop.sh bash file that closes the running docker-compose for the 
#              scan-scan-api-internal part of the project in a proper and safe manner.
# ------------------------------------------------------------------------------------------------
# Notes: You only need to use this if you ever wish to run this part of SCAN on its own.
# ------------------------------------------------------------------------------------------------
# References: 
# =================================================================================================


# Make sure the script exits if anything goes wrong
set -euxo pipefail

# Call Docker Compose and ask it to close down all related docker containers
docker-compose down
