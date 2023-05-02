<!--
=================================================================================================
 Project: SCAN - Searching Chemical Actions and Networks
                 Hokkaido University (2021)
                 Last Update: Q2 2023
________________________________________________________________________________________________
 Authors: Mikael Nicander Kuwahara (Lead Developer) [2022-]
          Jun Fujima (Former Lead Developer) [2021]
________________________________________________________________________________________________
 Description: This is the Main README file that explains how to get SCAN up & running.
------------------------------------------------------------------------------------------------
 Notes: 
------------------------------------------------------------------------------------------------
 References: 
=================================================================================================
-->
# SCAN Platform

This is a monorepo for SCAN Platform. It consists of three main components:

* scan-mariadb
  * Database
* scan_api_internal
  * Backend-api for scan-app
* scan_api_public
  * Public api app
* scan_app
  * Web interface for SCAN Platform
* scan-reverse-proxy (nginx)
  * Reverse proxy

# Full Documentation

Below in this ReadMe you find the basics of what is required and how to do it, but if you want a more extensive and detailed instructions for how to setup and configure a SCAN server or how to use it when it is up and running, then the two links just below, will be your friend in the night.

### SCAN Server Setup Manual
* [SCAN Server Setup Manual](https://github.com/scan-team/scan-platform-test/blob/main/scan-app/public/docs/SCAN-Server-Manual-Eng.pdf)
### SCAN User Manual
* [SCAN User Manual](https://github.com/scan-team/scan-platform-test/blob/main/scan-app/public/docs/SCAN-User-Manual-Eng.pdf)

# git clone submodules

```
git clone <this repogitory>
git submodule update --init --recursive
```

## Start up the platform

### Preparation

You need a docker environment installed with docker-compose.
Additionally, the following things are needed.

1. You need to set up an [auth0](https://auth0.com/) tenant and a Single Page Application. Please refer to the [documentation](https://auth0.com/docs) provided by auth0 for the detail general instruction.
2. Copy `.env.sample` to `.env` and edit it properly as instructed and guided by the file comments. Especially, you need to specify the correct auth0 variables (recieved above from Auth0 website).
3. Copy `scan-reverse-proxy/conf.d/nginx.conf.example` to `scan-reverse-proxy/conf.d/nginx.conf` and edit it properly (make sure the SSL Certificate files have the correct filenames).
4. Copy `docker-compose.yml.example` to `docker-compose.yml` and edit it properly (basically just make sure the real path to the SSL Certs are correct under the nginx-->volumes section).

### Start up

```
> ./start.sh
```

Then, access `http://localhost` via web browser. (Wait for seconds until all containers are ready to access...)

Note: If you are accessing your server remotely or for some reason can not use localhost, you must make sure to update all links in .env and Auth0.com accordingly with your requested IP settings


### Shut down the platform

```
> ./stop.sh
```

### Data import

Initially, the database is empty.
We provide an example data [here](https://drive.google.com/file/d/1VjsEwVdje4G1Ob1fEesMRXmRQRBaajr1/view?usp=sharing).

You may download and import it for test purpose.

To import it, you may

```
> scan-mariadb/import.sh export.sql
```

## LICENSE

[GPL 3.0](https://github.com/scan-team/scan-platform-test/blob/main/LICENCE)
