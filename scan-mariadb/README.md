# scan-mysql

## Usage

Before building containers, set environment variable `USERID` and `GROUPID` for specifying the execution user.




### Build image

```shell
$ USERID=$(id -u) GROUPID=$(id -g) docker-compose build
```

### Start up container

```shell
$ ./start.sh
```

### Build and start container

```shell
$ USERID=$(id -u) GROUPID=$(id -g) docker-compose up -d --build
```

### Log into the container

```shell
$ docker exec -it -u 0 mysql_host bash -p
```

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

### Stop the containers

```shell
$ ./stop.sh
```

### Stop and clean up the containers

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
