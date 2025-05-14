#!/usr/bin/env bash
set -euxo pipefail

docker compose down api

docker compose build api

docker image prune -f

docker compose up -d api

docker compose logs -f api
