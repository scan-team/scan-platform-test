# =================================================================================================
# Project: SCAN - Searching Chemical Actions and Networks
#          Hokkaido University (2021)
#          Last Update: Q2 2023
# ________________________________________________________________________________________________
# Authors: Mikael Nicander Kuwahara (Lead Developer) [2022-]
#          Jun Fujima (Former Lead Developer) [2021]
#          NorthGrid (Support Dev)
# ________________________________________________________________________________________________
# Description: ---
# ------------------------------------------------------------------------------------------------
# Notes: 
# ------------------------------------------------------------------------------------------------
# References: 
# =================================================================================================


tar zcvf scan_product_ready_files.tgz \
start.sh stop.sh .env.sample \
docker-compose.yml.example \
scan-mariadb/docker/db/init \
scan-mariadb/docker/db/scripts \
scan-mariadb/docker/db/my.cnf \
scan-reverse-proxy/conf.d/nginx.conf.example \
scan-reverse-proxy/root \
scan_api_public/keyfiles \
scan-mariadb/docker/db/data/.gitkeep \
scan-reverse-proxy/log/.gitkeep \
scan_data_observer/data/.gitignore \
scan_data_observer/logs/.gitignore
