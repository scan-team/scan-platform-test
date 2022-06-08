#!/bin/bash

# =================================================================================================
# Project: SCAN - Searching Chemical Actions and Networks
#          Hokkaido University (2021)
# ________________________________________________________________________________________________
# Authors: Jun Fujima (Former Lead Developer) [2021]
#          Mikael Nicander Kuwahara (Current Lead Developer) [2022-]
# ________________________________________________________________________________________________
# Description: This is the update-all.sh bash file that calls most other update scripts for the 
#              scan-api-internal part of the project in a proper and safe manner within the 
#              Docker compose environment.
# ------------------------------------------------------------------------------------------------
# Notes: 
# ------------------------------------------------------------------------------------------------
# References: 
# =================================================================================================


# Make sure the script exits if anything goes wrong
set -euxo pipefail

# Tells Docker Compose to run all individual data update python scripts that for the data
docker-compose exec api bash -c "source activate scan-env; python python-scripts/update-eq-structures_mp.py -c 4"
docker-compose exec api bash -c "source activate scan-env; python python-scripts/update-edge-structures_mp.py -c 4"
docker-compose exec api bash -c "source activate scan-env; python python-scripts/update-map-graphs.py"
