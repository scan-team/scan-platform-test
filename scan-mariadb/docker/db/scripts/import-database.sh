#!/usr/bin/env bash
set -euxo pipefail

mysql -u ${MYSQL_USER} -p scan_database < ./export.sql