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

FROM condaforge/miniforge3

LABEL maintainer "jfujima"
RUN set -ex \
  && apt-get update -y --fix-missing \
  && apt-get install -y -q --no-install-recommends \
  curl \
  file \
  && apt-get purge -y --auto-remove

WORKDIR /var/app/scan_api_internal

# install poetry
RUN curl -sSL https://raw.githubusercontent.com/python-poetry/poetry/master/install-poetry.py | python -
ENV PATH /root/.local/bin:$PATH

ENV PATH /opt/miniconda3/bin:$PATH

# create conda env
COPY env.yaml ./
RUN conda env create -f env.yaml
SHELL ["conda", "run", "-n", "scan-env", "/bin/bash", "-c"]

# FOR interactive shell
RUN echo "source activate scan-env" >> ~/.bashrc

# install dependencies
COPY poetry.toml poetry.lock pyproject.toml ./
RUN poetry install

RUN conda env list
RUN conda list

# add to application
COPY app.py ./
ADD service service
# ADD scan_analytics scan_analytics TODO: Remove if all seems to work fine
ADD grrm grrm
ADD python-scripts python-scripts
ADD gunicorn.conf.py ./

EXPOSE 8000
CMD ["conda", "run", "--no-capture-output", "-n", "scan-env", "gunicorn", "app:api", "--config", "gunicorn.conf.py"]
