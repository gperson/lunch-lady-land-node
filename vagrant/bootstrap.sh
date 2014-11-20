#!/usr/bin/env bash

sudo apt-get update
sudo apt-get upgrade -y
sudo apt-get install -y docker.io
docker run -itd -p 4968:4968 --name="lll" --restart="always" darklance/lll-node-server