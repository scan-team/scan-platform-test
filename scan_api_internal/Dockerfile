# =================================================================================================
# Project: SCAN - Searching Chemical Actions and Networks
#          Hokkaido University (2021)
#          Last Update: Q2 2023
# ________________________________________________________________________________________________
# Authors: Mikael Nicander Kuwahara (Lead Developer) [2022-]
#          Jun Fujima (Former Lead Developer) [2021]
# ________________________________________________________________________________________________
# Description: This is the Dockerfile for the scan-api-internal part of the SCAN Project.
# ------------------------------------------------------------------------------------------------
# Notes: 
# ------------------------------------------------------------------------------------------------
# References: 
# =================================================================================================

FROM scan_api_internal-dev
LABEL maintainer "jfujima"

# add to application
COPY app.py ./
ADD service service
# ADD scan_analytics scan_analytics TODO: Remove if all seems to work fine
ADD grrm grrm
ADD python-scripts python-scripts
ADD gunicorn.conf.py ./

EXPOSE 8000
CMD ["conda", "run", "--no-capture-output", "-n", "scan-env", "gunicorn", "app:api", "--config", "gunicorn.conf.py"]
