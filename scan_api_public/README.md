# scan_api app

## run on local

```shell
$ pipenv run python app.py
```

or

```shell
$ pipenv run uvicorn app:api --reload
```

## with docker-compose

```shell
$ docker-compose -f docker-compose-local.yml up -d --build
```

## down the containers

```shell
$ docker-compose -f docker-compose-local.yml down --rmi all
```
