#!/bin/bash

log=/logs/$(date '+%Y%m%d-%H%M%S').log
exec &> >(tee -a $log)

python3 import_data_multi.py $1
docker exec scan_api_internal bash -c "source activate scan-env; python python-scripts/update-map-graphs.py"
docker exec scan_api_internal bash -c "source activate scan-env; python python-scripts/update-eq-measures.py"