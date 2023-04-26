#!/bin/sh

# =================================================================================================
# Project: SCAN - Searching Chemical Actions and Networks
#          Hokkaido University (2021)
#          Last Update: Q2 2023
# ________________________________________________________________________________________________
# Authors: Mikael Nicander Kuwahara (Lead Developer) [2022-]
#          Jun Fujima (Former Lead Developer) [2021]
# ________________________________________________________________________________________________
# Description: This is the file that manages docker images to be saved for future use.
# ------------------------------------------------------------------------------------------------
# Notes: 
# ------------------------------------------------------------------------------------------------
# References: 
# =================================================================================================


# Calls for the docker system to create an image of the current data and send it to the server
target_host=$1
docker save scan-mariadb scan_api_public scan_api_internal scan-app scan_data_observer | bzip2 | ssh $target_host docker load