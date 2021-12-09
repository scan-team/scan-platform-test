#!/usr/bin/env bash
set -euxo pipefail

mysql -u root -p  < /root/mychem/src/mychemdb.sql