#!/usr/bin/env bash

sudo apt-get update
sudo apt-get upgrade -y
sudo apt-get install -y docker.io
docker run -p 3306:3306 --name lll-db  --restart="always" -e MYSQL_ROOT_PASSWORD=root -e MYSQL_DATABASE=lunch_lady_land -d mysql 
docker run -d -p 4968:4968 --name="lll" --restart="always" --link lll-db:db darklance/lll-node-server