docker build ./scan-mariadb/docker/db -t scan-mariadb
docker build ./scan_api_internal -t scan_api_internal -f ./scan-app/Dockerfile-dev
docker build ./scan_api_public -t scan_api_public -f ./scan-app/Dockerfile-dev
docker build ./scan-app -t scan-app -f ./scan-app/Dockerfile-dev --build-arg NEXT_PUBLIC_SCAN_API_PROXY_ROOT=${NEXT_PUBLIC_SCAN_API_PROXY_ROOT} --build-arg NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=${NEXT_PUBLIC_GOOGLE_ANALYTICS_ID}
docker build ./scan_data_observer -t scan_data_observer 
docker build ./scan_data_observer/scan_data_importer -t scan_data_importer