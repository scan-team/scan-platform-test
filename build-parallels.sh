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

function build_scan_api_internal(){
  echo ====================
  echo buiding scan_api_internal-dev
  time docker build $NO_CACHE_OPTION_FORCE ./scan_api_internal -t scan_api_internal-dev -f ./scan_api_internal/Dockerfile-dev
  echo ====================
  echo buiding scan_api_internal
  time docker build $NO_CACHE_OPTION ./scan_api_internal -t scan_api_internal
}

function build_scan_api_public(){
  echo ====================
  echo buiding scan_api_public-dev
  time docker build $NO_CACHE_OPTION_FORCE ./scan_api_public -t scan_api_public-dev -f ./scan_api_public/Dockerfile-dev
  echo ====================
  echo buiding scan_api_public
  time docker build $NO_CACHE_OPTION ./scan_api_public -t scan_api_public 
}

function build_scan_data_observer(){
  echo ====================
  echo buiding scan_data_importer
  time docker build $NO_CACHE_OPTION_FORCE ./scan_data_observer/scan_data_importer -t scan_data_importer
  echo ====================
  echo buiding scan_data_observer
  time docker build $NO_CACHE_OPTION_FORCE ./scan_data_observer -t scan_data_observer 
}

function build_mariadb(){
  echo ====================
  echo buiding scan-mariadb
  time docker build $NO_CACHE_OPTION_FORCE ./scan-mariadb/docker/db -t scan-mariadb
}

function build_scanapp(){
  echo ====================
  echo buiding scan-app
  time docker build $NO_CACHE_OPTION ./scan-app -t scan-app --build-arg NEXT_PUBLIC_SCAN_API_PROXY_ROOT=${NEXT_PUBLIC_SCAN_API_PROXY_ROOT} --build-arg NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=${NEXT_PUBLIC_GOOGLE_ANALYTICS_ID}
}

mkdir -p build-log
build_scan_api_internal > build-log/api_internal.$$.log 2>&1  &
build_scan_data_observer > build-log/observer.$$.log 2>&1 &
build_mariadb > build-log/mariadb.$$.log 2>&1  &
build_scanapp > build-log/app.$$.log 2>&1 &
build_scan_api_public > build-log/api_public.$$.log 2>&1 &

wait