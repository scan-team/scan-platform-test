#!/bin/bash
set -euxo pipefail

export USERID=$(id -u)
export GROUPID=$(id -g)

if [ $# -ge 1 ]; then
  OPS=$1
fi

docker-compose exec db bash -c "chmod 0775 /scripts/export-database.sh"

if [ -v OPS ]; then
  docker-compose exec  -u 0 db bash -c "/scripts/export-database.sh $OPS"
else
  docker-compose exec  -u 0 db bash -c "/scripts/export-database.sh"
fi

docker cp mysql_host:/export.sql export.sql

docker-compose exec -u 0 db bash -c "rm /export.sql"