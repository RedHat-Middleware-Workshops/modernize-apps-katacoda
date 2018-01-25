#!/usr/bin/env bash
ssh root@host01 "bash <(curl -sL https://raw.githubusercontent.com/RedHat-Middleware-Workshops/modernize-apps-katacoda/master/assets/.init.sh)"

# Kill things that may have been previously created in this scenario
ssh root@host01 "pkill -f 'oc --server https://master:8443 rsync deployments'"
ssh root@host01 "pkill -f 'oc --server https://master:8443 port-forward'"
ssh root@host01 "pkill -f 'jdb -attach localhost:8787'"
