#!/bin/sh
target_host=$1
docker save scan-mariadb scan_api_public scan_api_internal scan-app scan_data_observer | bzip2 | ssh $target_host docker load