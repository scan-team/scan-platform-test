#!/usr/bin/env bash

# =================================================================================================
# Project: SCAN - Searching Chemical Actions and Networks
#          Hokkaido University (2021)
# ________________________________________________________________________________________________
# Authors: Jun Fujima (Former Lead Developer) [2021]
#          Mikael Nicander Kuwahara (Current Lead Developer) [2022-]
# ________________________________________________________________________________________________
# Description: This is the Add-Open-Babel bash script file that adds the Open Babel and MyChem 
#              functionality to the scan-mariadb database part of the project.
# ------------------------------------------------------------------------------------------------
# Notes: 
# ------------------------------------------------------------------------------------------------
# References: 
# =================================================================================================


# Make sure the script exits if anything goes wrong
set -euxo pipefail

# Adds MyChemDB functiinality
mysql -u root -p  < /root/mychem/src/mychemdb.sql
