#!/bin/bash

# =================================================================================================
# Project: SCAN - Searching Chemical Actions and Networks
#          Hokkaido University (2021)
# ________________________________________________________________________________________________
# Authors: Jun Fujima (Former Lead Developer) [2021]
#          Mikael Nicander Kuwahara (Current Lead Developer) [2022-]
# ________________________________________________________________________________________________
# Description: This is the export.sh bash file that calls for Dockers internal database 
#              export script to run.
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

# Tells Docker Compose to prepare and run the shell script that exports a specified Database to a sql-file
OPS=
if [ $# -ge 1 ]; then
  OPS=$1
fi

docker-compose exec db bash -c "chmod 0775 /scripts/export-database.sh"

if [ -n "$OPS" ]; then
  echo '"$OPS" is set'
  docker-compose exec  -u 0 db bash -c "/scripts/export-database.sh $OPS"
else
  echo "no options"
  docker-compose exec  -u 0 db bash -c "/scripts/export-database.sh"
fi

docker cp mysql_host:/export.sql export.sql

docker-compose exec -u 0 db bash -c "rm /export.sql"
