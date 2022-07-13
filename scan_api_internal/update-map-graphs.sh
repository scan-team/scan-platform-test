#!/bin/bash

# =================================================================================================
# Project: SCAN - Searching Chemical Actions and Networks
#          Hokkaido University (2021)
# ________________________________________________________________________________________________
# Authors: Jun Fujima (Former Lead Developer) [2021]
#          Mikael Nicander Kuwahara (Current Lead Developer) [2022-]
# ________________________________________________________________________________________________
# Description: This is the update-map-graphs.sh bash file that calls the equivalent 
#              python script for the scan-api-internal part of the project to update the current 
#              map graphs data within the Docker compose environment.
# ------------------------------------------------------------------------------------------------
# Notes: 
# ------------------------------------------------------------------------------------------------
# References: 
# =================================================================================================


# Make sure the script exits if anything goes wrong
set -euxo pipefail

# Tells Docker Compose to run the python script that updates the map graphs of the data
docker-compose exec api bash -c "source activate scan-env; python python-scripts/update-map-graphs.py"
