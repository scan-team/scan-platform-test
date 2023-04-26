<!---
=================================================================================================
 Project: SCAN - Searching Chemical Actions and Networks
                 Hokkaido University (2021)
                 Last Update: Q2 2023
________________________________________________________________________________________________
 Authors: Mikael Nicander Kuwahara (Lead Developer) [2022-]
          Jun Fujima (Former Lead Developer) [2021]
________________________________________________________________________________________________
 Description: This is the scan-api-public README.md file that explains how to get the 
              public api service (python) up & running and how to manage it.
------------------------------------------------------------------------------------------------
 Notes: 
------------------------------------------------------------------------------------------------
 References: 
=================================================================================================
--->
# SCAN API for Public

## For local development

```shell
$ pipenv run python app.py
```

or

```shell
$ pipenv run uvicorn app:api --reload
```

## With docker-compose

```shell
$ docker-compose -f docker-compose-local.yml up -d --build
```

## Down the containers

```shell
$ docker-compose -f docker-compose-local.yml down --rmi all
```
