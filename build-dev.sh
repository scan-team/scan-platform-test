#!/bin/bash

while (( $# > 0 ))
do
  case $1 in
    --no-cache)
      NO_CACHE_OPTION=$1
  esac
  shift
done

docker build $NO_CACHE_OPTION ./scan-mariadb/docker/db -t scan-mariadb
docker build $NO_CACHE_OPTION ./scan_api_internal -t scan_api_internal-dev -f ./scan_api_internal/Dockerfile-dev
docker build $NO_CACHE_OPTION ./scan_api_public -t scan_api_public-dev -f ./scan_api_public/Dockerfile-dev
docker build $NO_CACHE_OPTION ./scan-app -t scan-app-dev -f ./scan-app/Dockerfile-dev --build-arg NEXT_PUBLIC_SCAN_API_PROXY_ROOT=${NEXT_PUBLIC_SCAN_API_PROXY_ROOT} --build-arg NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=${NEXT_PUBLIC_GOOGLE_ANALYTICS_ID}
docker build $NO_CACHE_OPTION ./scan_data_observer -t scan_data_observer 
docker build $NO_CACHE_OPTION ./scan_data_observer/scan_data_importer -t scan_data_importer