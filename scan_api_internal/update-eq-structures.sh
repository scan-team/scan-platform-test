#!/bin/bash
set -euxo pipefail

docker-compose exec api bash -c "source activate scan-env; python python-scripts/update-eq-structures_mp.py -c 4"