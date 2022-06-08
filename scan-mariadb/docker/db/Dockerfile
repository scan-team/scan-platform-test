# =================================================================================================
# Project: SCAN - Searching Chemical Actions and Networks
#          Hokkaido University (2021)
# ________________________________________________________________________________________________
# Authors: Jun Fujima (Former Lead Developer) [2021]
#          Mikael Nicander Kuwahara (Current Lead Developer) [2022-]
# ________________________________________________________________________________________________
# Description: This is the Dockerfile for the mariadb Database part of the SCAN Project.
# ------------------------------------------------------------------------------------------------
# Notes: 
# ------------------------------------------------------------------------------------------------
# References: 
# =================================================================================================

FROM mariadb:10.2

RUN apt-get update && apt-get install -y \
  openbabel \
  libopenbabel-dev \
  build-essential \
  pkg-config \
  libmysqlclient-dev \
  cmake \
  git \
  wget \
  pv

WORKDIR /root/mychem

RUN git clone https://github.com/jfujima/mychem-code.git /root/mychem

RUN chmod 755 /root/mychem
WORKDIR /root/mychem/build

RUN cmake ..

RUN make

RUN make install

WORKDIR /

VOLUME ["/scripts"]

CMD ["mysqld"]
