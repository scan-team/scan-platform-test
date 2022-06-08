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

FROM python:3.8

LABEL maintainer "jfujima"
RUN set -ex \
  && apt-get update -y --fix-missing \
  && apt-get install -y -q --no-install-recommends \
  curl \
  file \
  && apt-get purge -y --auto-remove

# install
RUN pip install pipenv
ADD Pipfile Pipfile.lock /
RUN pipenv install --system

# add to application
ADD app.py /
ADD service service
ADD grrm grrm
ADD keyfiles keyfiles

RUN echo $PUBLIC_API_ROOT_PATH

EXPOSE 8000
CMD uvicorn app:api --host 0.0.0.0 --port 8000 --root-path $PUBLIC_API_ROOT_PATH
