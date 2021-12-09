#!/usr/bin/env bash
#wait for the MySQL Server to come up
#sleep 90s

#run the setup script to create the DB and the schema in the DB
mysql -u ${MYSQL_USER} -p scan_database < "/docker-entrypoint-initdb.d/001-drop-tables.sql"
mysql -u ${MYSQL_USER} -p scan_database < "/docker-entrypoint-initdb.d/002-create-tables.sql"