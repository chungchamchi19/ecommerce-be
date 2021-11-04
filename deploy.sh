#!/bin/bash

cp docker-compose.prod docker-compose.yml && \
cp Dockerfile.prod Dockerfile && \
docker-compose build && \
docker-compose run --rm backend yarn && \
docker-compose up -d --force-recreate
