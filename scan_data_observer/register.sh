#!/bin/bash

# =================================================================================================
# Project: SCAN - Searching Chemical Actions and Networks
#          Hokkaido University (2021)
#          Last Update: Q2 2023
# ________________________________________________________________________________________________
# Authors: NorthGrid (Support Dev)
#          Mikael Nicander Kuwahara (Lead Developer) [2022-]
#          Jun Fujima (Former Lead Developer) [2021]
# ________________________________________________________________________________________________
# Description: This is the register.sh file that get the data from the dedicated folder and read 
#              and push into the DB.
# ------------------------------------------------------------------------------------------------
# Notes: This was part of the NorthGrid Support in 2022 
# ------------------------------------------------------------------------------------------------
# References: 
# =================================================================================================

# Log the process of registration
log=/logs/$(date '+%Y%m%d-%H%M%S').log
exec &> >(tee -a $log)

# get the new data from the dedicated folder and register it to the DB
echo `date` start registoration
time (python3 import_data_multi.py $1
docker exec scan_api_internal bash -c "source activate scan-env; python python-scripts/update-map-graphs.py"
docker exec scan_api_internal bash -c "source activate scan-env; python python-scripts/update-eq-measures.py"
rm $2)
echo `date` finished
