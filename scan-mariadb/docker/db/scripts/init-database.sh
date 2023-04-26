#!/usr/bin/env bash

# =================================================================================================
# Project: SCAN - Searching Chemical Actions and Networks
#          Hokkaido University (2021)
#          Last Update: Q2 2023
# ________________________________________________________________________________________________
# Authors: Mikael Nicander Kuwahara (Lead Developer) [2022-]
#          Jun Fujima (Former Lead Developer) [2021]
# ________________________________________________________________________________________________
# Description: This is the Init-Database bash script file that initiates the scan-mariadb 
#              database part of the project.
# ------------------------------------------------------------------------------------------------
# Notes: 
# ------------------------------------------------------------------------------------------------
# References: 
# =================================================================================================


# Run the setup script to create the DB and the schema in the DB
mysql -u ${MYSQL_USER} -p scan_database < "/docker-entrypoint-initdb.d/001-drop-tables.sql"
mysql -u ${MYSQL_USER} -p scan_database < "/docker-entrypoint-initdb.d/002-create-tables.sql"
