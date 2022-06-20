#!/bin/bash
set -euxo pipefail

export USERID=$(id -u)
export GROUPID=$(id -g)

docker-compose -f docker-compose-dev.yml down
