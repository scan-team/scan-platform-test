# =================================================================================================
# Project: SCAN - Searching Chemical Actions and Networks
#          Hokkaido University (2021)
# ________________________________________________________________________________________________
# Authors: Jun Fujima (Former Lead Developer) [2021]
#          Mikael Nicander Kuwahara (Current Lead Developer) [2022-]
# ________________________________________________________________________________________________
# Description: This is the gunicorn configuration file for the scan-api-internal part of the 
#              SCAN Project.
#              It configures the WSGI Server (Web Server Gateway Interface). 
# ------------------------------------------------------------------------------------------------
# Notes: 
# ------------------------------------------------------------------------------------------------
# References: 
# =================================================================================================

import os

API_WORKERS = os.environ.get("API_WORKERS", 2 * os.cpu_count() + 1)

bind = '0.0.0.0:8000'

# Worker Processes
workers = API_WORKERS
threads = 2
worker_class = 'uvicorn.workers.UvicornWorker'

print("workers: ", workers)
