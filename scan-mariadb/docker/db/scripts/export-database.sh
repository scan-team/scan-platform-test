#!/usr/bin/env bash
set -euxo pipefail

if [ $# -ge 1 ]; then
  OPS=$1
fi


if [ -v OPS ]; then
  mysqldump -u root -p $OPS scan_database> /export.sql
else
  mysqldump -u root -p scan_database > /export.sql
fi