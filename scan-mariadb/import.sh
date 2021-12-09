#!/bin/bash
set -euxo pipefail

export USERID=$(id -u)
export GROUPID=$(id -g)

docker cp $1 mysql_host:/export.sql

docker-compose exec db bash -c "chmod 0775 /scripts/import-database.sh"
docker-compose exec db bash -c "/scripts/import-database.sh"

docker-compose exec -u 0 db bash -c "rm /export.sql"