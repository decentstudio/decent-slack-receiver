#!/bin/bash

docker build -t decentstudio/decent-slack-receiver:latest .

docker build -t decentstudio/decent-slack-receiver:$CIRCLE_TAG .

docker login -u $DOCKER_ID -p $DOCKER_PASS

docker push decentstudio/decent-slack-receiver:latest

decentstudio/decent-slack-receiver:$CIRCLE_TAG
