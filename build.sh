#!/bin/bash

# =================================================================================================
# Project: SCAN - Searching Chemical Actions and Networks
#          Hokkaido University (2021)
#          Last Update: Q2 2023
# ________________________________________________________________________________________________
# Authors: Mikael Nicander Kuwahara (Lead Developer) [2022-]
#          Jun Fujima (Former Lead Developer) [2021]
#          NorthGrid (Support Dev)
# ________________________________________________________________________________________________
# Description: This is the file that builds docker containers for the total project.
# ------------------------------------------------------------------------------------------------
# Notes: 
# ------------------------------------------------------------------------------------------------
# References: 
# =================================================================================================


# Prepare the build
while (( $# > 0 ))
do
  case $1 in
    --no-cache)
      NO_CACHE_OPTION='--no-cache'
      ;;
    --force)
      NO_CACHE_OPTION='--no-cache'
      NO_CACHE_OPTION_FORCE='--no-cache'
      ;;
  esac
  shift
done

. .env

# Do the build and keep the building information flowing
echo ====================
echo buiding scan_api_internal-dev
time docker build $NO_CACHE_OPTION_FORCE ./scan_api_internal -t scan_api_internal-dev -f ./scan_api_internal/Dockerfile-dev
echo ====================
echo buiding scan_api_public-dev
time docker build $NO_CACHE_OPTION_FORCE ./scan_api_public -t scan_api_public-dev -f ./scan_api_public/Dockerfile-dev

echo ====================
echo buiding scan-mariadb
time docker build $NO_CACHE_OPTION_FORCE ./scan-mariadb/docker/db -t scan-mariadb
echo ====================
echo buiding scan_api_internal
time docker build $NO_CACHE_OPTION ./scan_api_internal -t scan_api_internal
echo ====================
echo buiding scan_api_public
time docker build $NO_CACHE_OPTION ./scan_api_public -t scan_api_public 
echo ====================
echo buiding scan-app
time docker build $NO_CACHE_OPTION ./scan-app -t scan-app --build-arg NEXT_PUBLIC_SCAN_API_PROXY_ROOT=${NEXT_PUBLIC_SCAN_API_PROXY_ROOT} --build-arg NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=${NEXT_PUBLIC_GOOGLE_ANALYTICS_ID}
echo ====================
echo buiding scan_data_importer
time docker build $NO_CACHE_OPTION_FORCE ./scan_data_observer/scan_data_importer -t scan_data_importer
echo ====================
echo buiding scan_data_observer
time docker build $NO_CACHE_OPTION_FORCE ./scan_data_observer -t scan_data_observer 
