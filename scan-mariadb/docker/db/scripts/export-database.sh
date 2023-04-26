#!/usr/bin/env bash

# =================================================================================================
# Project: SCAN - Searching Chemical Actions and Networks
#          Hokkaido University (2021)
#          Last Update: Q2 2023
# ________________________________________________________________________________________________
# Authors: Mikael Nicander Kuwahara (Lead Developer) [2022-]
#          Jun Fujima (Former Lead Developer) [2021]
# ________________________________________________________________________________________________
# Description: This is the Export-Database bash script file that export the current db into a file
#              for the scan-mariadb database part of the SCAN project.
# ------------------------------------------------------------------------------------------------
# Notes: 
# ------------------------------------------------------------------------------------------------
# References: 
# =================================================================================================


# Make sure the script exits if anything goes wrong
set -euxo pipefail

# Export the Scan DB into a file.
if [ $# -ge 1 ]; then
  OPS=$1
fi

if [ -v OPS ]; then  
  mysqldump -u root -p${MYSQL_ROOT_PASSWORD} $OPS scan_database |  pv -s 1g > /export.sql
else
  mysqldump -u root -p${MYSQL_ROOT_PASSWORD} scan_database | pv -s 1g > /export.sql
fi
