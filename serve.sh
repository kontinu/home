#!/bin/bash

# export baseurl=$(grep --color=no "baseurl" _config.yml |sed "s/: /=/g")
# export $baseurl


sleep 10 && open "http://localhost:4000/" &

docker-compose up --build --force-recreate --exit-code-from page "$@" || {
    jobs
    kill %-
}