# =================================================================================================
# Project: SCAN - Searching Chemical Actions and Networks
#          Hokkaido University (2021)
#          Last Update: Q2 2023
# ________________________________________________________________________________________________
# Authors: NorthGrid (Support Dev)
#          Mikael Nicander Kuwahara (Lead Developer) [2022-]
#          Jun Fujima (Former Lead Developer) [2021]
# ________________________________________________________________________________________________
# Description: This is the Dockerfile for the Scan Data Observer part of the SCAN Project.
# ------------------------------------------------------------------------------------------------
# Notes: This was part of the NorthGrid Support in 2022 
# ------------------------------------------------------------------------------------------------
# References: 
# =================================================================================================

FROM scan_data_importer

RUN apt-get update && \
    apt-get install -y \
    ca-certificates \
    curl \
    gnupg \
    lsb-release && \
    mkdir -p /etc/apt/keyrings && \ 
    curl -fsSL https://download.docker.com/linux/debian/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg && \
 echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/debian \
  $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null && \
  apt-get update && \
  apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

RUN pip install pipenv
COPY Pipfile Pipfile.lock /
RUN pipenv install --system

COPY observer.py register.sh /
 
CMD ["python", "observer.py", "/data"]