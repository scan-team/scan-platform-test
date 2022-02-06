# SCAN Platform test

This is a monorepo for SCAN Platform. It consists of three main components:

* scan-mariadb
  * Database
* scan-api-internal
  * Backend-api for scan-app
* scan-app
  * Web interface for SCAN Platform


## Start up the platform

### Preparation

You need a docker installed environment and docker-compose.
Additionally, the following things are needed.

1. You need to set up an [auth0](https://auth0.com/) tenant and a Single Page Application. Please refer to the [documentation](https://auth0.com/docs) provided by auth0 for the detail instruction.

2. Copy `.env.sample` to `.env` and edit it property. Especially, you need to specify the correct auth0 variables.

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