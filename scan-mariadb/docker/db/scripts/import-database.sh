#!/usr/bin/env bash
set -euxo pipefail

# mysql -u ${MYSQL_USER} -p scan_database < ./export.sql
pv ./export.sql | mysql -u ${MYSQL_USER} -p${MYSQL_PASSWORD} scan_database
