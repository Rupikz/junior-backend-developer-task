#!/bin/bash

export DB_USERNAME=admin
export DB_PASSWORD=
export DB_PORT=27017
export DB_NAME=token
docker-compose --file=docker-compose.yml up --build --abort-on-container-exit
