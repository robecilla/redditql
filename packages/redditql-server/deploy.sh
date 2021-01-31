#!/bin/bash

docker image rm robecilla/redditql:1

docker build -t robecilla/redditql:1 .
docker push robecilla/redditql:1

ssh root@redditqlapi.chorbo.rocks "
docker pull robecilla/redditql:1 &&
docker tag robecilla/redditql:1 dokku/redditqlapi:1 &&
dokku tags:deploy redditqlapi 1 &&
docker image rm robecilla/redditql:1
"
