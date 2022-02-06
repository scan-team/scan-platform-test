#!/usr/bin/env bash
set -euxo pipefail

if [ $# -ge 1 ]; then
  OPS=$1
fi


if [ -v OPS ]; then
  # mysqldump -u root -p${MYSQL_ROOT_PASSWORD} $OPS scan_database > /export.sql
  mysqldump -u root -p${MYSQL_ROOT_PASSWORD} $OPS scan_database |  pv -s 1g > /export.sql
else
  # mysqldump -u root -p scan_database > /export.sql
  mysqldump -u root -p${MYSQL_ROOT_PASSWORD} scan_database | pv -s 1g > /export.sql
fi