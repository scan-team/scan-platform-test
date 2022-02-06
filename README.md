# SCAN Platform test

This is a monorepo for SCAN Platform. It consists of three main components:

* mysql_host
  * Database
* scan_api_internal
  * Backend-api for scan-app
* scan_api_public
  * Public api app
* scan_app
  * Web interface for SCAN Platform
* nginx
  * Reverse proxy


## Start up the platform

### Preparation

You need a docker installed environment and docker-compose.
Additionally, the following things are needed.

1. You need to set up an [auth0](https://auth0.com/) tenant and a Single Page Application. Please refer to the [documentation](https://auth0.com/docs) provided by auth0 for the detail instruction.

2. Copy `.env.sample` to `.env` and edit it properly. Especially, you need to specify the correct auth0 variables.
3. Copy `scan-reverse-proxy/conf.d/nginx.conf.example` to `scan-reverse-proxy/conf.d/nginx.conf` and edit it properly.
4. Copy `docker-compose.yml.example` to `docker-compose.yml` and edit it properly.


### Start up

```
> ./start.sh
```

Then, access `http://localhost` via web browser. (Wait for seconds until all containers are ready to access...)


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

MIT