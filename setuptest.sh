#!/bin/bash
docker build -t pg:latest .
[ "$(docker ps -a | grep pg_db_test)" ] && docker rm -f pg_db_test
docker run -d -P -p 5434:5432 --name pg_db_test pg
sleep 5
yarn test