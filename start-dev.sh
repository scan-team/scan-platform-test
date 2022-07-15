#!/bin/bash
set -euxo pipefail

export USERID=$(id -u)
export GROUPID=$(id -g)

./build-dev.sh

docker-compose -f docker-compose-dev.yml up -d
