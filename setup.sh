#!/bin/bash
docker build -t pg:latest .
[ "$(docker ps -a | grep pg_db)" ] && docker rm -f pg_db
docker run -d -P -p 5433:5432 --name pg_db pg
sleep 5
yarn start