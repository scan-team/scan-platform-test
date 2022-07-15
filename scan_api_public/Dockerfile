# =================================================================================================
# Project: SCAN - Searching Chemical Actions and Networks
#          Hokkaido University (2021)
# ________________________________________________________________________________________________
# Authors: Jun Fujima (Former Lead Developer) [2021]
#          Mikael Nicander Kuwahara (Current Lead Developer) [2022-]
# ________________________________________________________________________________________________
# Description: This is the Dockerfile for the scan-api-public part of the SCAN Project.
# ------------------------------------------------------------------------------------------------
# Notes: 
# ------------------------------------------------------------------------------------------------
# References: 
# =================================================================================================
FROM scan_api_public-dev
LABEL maintainer "jfujima"

# add to application
ADD app.py /
ADD service service
ADD grrm grrm
ADD keyfiles keyfiles

RUN echo $PUBLIC_API_ROOT_PATH

EXPOSE 8000
CMD uvicorn app:api --host 0.0.0.0 --port 8000 --root-path $PUBLIC_API_ROOT_PATH
