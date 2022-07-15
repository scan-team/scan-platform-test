# =================================================================================================
# Project: SCAN - Searching Chemical Actions and Networks
#          Hokkaido University (2021)
# ________________________________________________________________________________________________
# Authors: Jun Fujima (Former Lead Developer) [2021]
#          Mikael Nicander Kuwahara (Current Lead Developer) [2022-]
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
