#!/bin/bash
set -euxo pipefail

export USERID=$(id -u)
export GROUPID=$(id -g)

docker-compose exec db bash -c "chmod 0775 /scripts/init-database.sh"
docker-compose exec db bash -c "/scripts/init-database.sh"