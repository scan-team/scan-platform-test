#!/bin/sh

docker-compose exec api_internal conda run -n scan-env python grant.py $@