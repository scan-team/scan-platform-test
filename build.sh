#!/bin/bash

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
echo buiding scan_data_observer
time docker build $NO_CACHE_OPTION_FORCE ./scan_data_observer -t scan_data_observer 
echo ====================
echo buiding scan_data_importer
time docker build $NO_CACHE_OPTION_FORCE ./scan_data_observer/scan_data_importer -t scan_data_importer
