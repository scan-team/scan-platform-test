#!/bin/bash
set -euxo pipefail

export USERID=$(id -u)
export GROUPID=$(id -g)

docker-compose exec db bash -c "chmod 0775 /scripts/add-tables.sh"
docker-compose exec db bash -c "/scripts/add-tables.sh"