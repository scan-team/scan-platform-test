#!/bin/bash

# =================================================================================================
# Project: SCAN - Searching Chemical Actions and Networks
#          Hokkaido University (2021)
# ________________________________________________________________________________________________
# Authors: Jun Fujima (Former Lead Developer) [2021]
#          Mikael Nicander Kuwahara (Current Lead Developer) [2022-]
# ________________________________________________________________________________________________
# Description: This is the init-mysql.sh bash file that calls for Dockers internal database 
#              initiation script to run.
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

# Tells Docker Compose to prepare and run the shell script that initiate the Database
docker-compose exec db bash -c "chmod 0775 /scripts/init-database.sh"
docker-compose exec db bash -c "/scripts/init-database.sh"
