#!/bin/bash

# =================================================================================================
# Project: SCAN - Searching Chemical Actions and Networks
#          Hokkaido University (2021)
#          Last Update: Q2 2023
# ________________________________________________________________________________________________
# Authors: Mikael Nicander Kuwahara (Lead Developer) [2022-]
#          Jun Fujima (Former Lead Developer) [2021]
# ________________________________________________________________________________________________
# Description: This is the import.sh bash file that that calls for Dockers internal database 
#              import script to run.
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

# Tells Docker Compose to prepare and run the shell script that imports a selected Database file
docker cp $1 mysql_host:/export.sql

docker-compose exec db bash -c "chmod 0775 /scripts/import-database.sh"
docker-compose exec db bash -c "/scripts/import-database.sh"

docker-compose exec -u 0 db bash -c "rm /export.sql"
