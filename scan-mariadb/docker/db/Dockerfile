# FROM mysql:5.7
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
# RUN git clone https://github.com/mychem/mychem-code.git /root/mychem
# RUN git clone https://github.com/Pansanel/mychem-code.git /root/mychem

RUN chmod 755 /root/mychem
WORKDIR /root/mychem/build

RUN cmake ..

RUN make

RUN make install

# RUN adduser scan
# USER scan

WORKDIR /

VOLUME ["/scripts"]

CMD ["mysqld"]
