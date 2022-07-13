<!---
=================================================================================================
 Project: SCAN - Searching Chemical Actions and Networks
                 Hokkaido University (2021)
________________________________________________________________________________________________
 Authors: Jun Fujima (Former Lead Developer) [2021]
          Mikael Nicander Kuwahara (Current Lead Developer) [2022-]
________________________________________________________________________________________________
 Description: This is the scan-maria Database README.md file that explains how to get the 
              databse up & running and how to manage it.
------------------------------------------------------------------------------------------------
 Notes: 
------------------------------------------------------------------------------------------------
 References: 
=================================================================================================
--->
# scan-mariadb (mySQL DB)

## Usage

Before building containers, set environment variable `USERID` and `GROUPID` for specifying the execution user.


### Start up container (using pre-made shell script file)

```shell
$ ./start.sh
```

### Build image (manually with bash command)

```shell
$ USERID=$(id -u) GROUPID=$(id -g) docker-compose build
```

### Build and start container (manually with bash command)

```shell
$ USERID=$(id -u) GROUPID=$(id -g) docker-compose up -d --build
```

### Log into the container (manually with bash command)

```shell
$ docker exec -it -u 0 mysql_host bash -p
```

## Database Command Scripts

### Init database (drop and create tables)

```shell
$ ./init-mysql.sh
```

### Add missing tables (when table definition is added)
```shell
$ ./add-new-tables.sh
```

### Import database

```shell
$ ./import.sh [SQL file]
```

### Export database

```shell
$ ./export.sh
```

#### Data-only export

```shell
$ ./export.sh --no-create-info
```


### myphpadmin

access `http://localhost:8080`

### Stop the containers (using pre-made shell script file)

```shell
$ ./stop.sh
```

### Stop and clean up the containers (manually with bash command)

```shell
$ docker-compose down --rmi all
```

### Enter shell on mysql container

```shell
$ docker exec -it mysql_host bash -p
```

```shell
\# mysql -u ${MYSQL_USER} -p
```
