#!/usr/bin/env bash

##
## Reset to beginning of Moving Existing Apps
## Desired State: everything reset
##

if [ "$(oc whoami)" != "developer" ] ; then
	echo "must login as developer first"
	exit 1
fi

oc delete project --all
while [ -n "$(oc get projects -o name)" ]; do
  echo "waiting for all projects to delete..."
  sleep 5
done

cd $HOME/projects
git reset --hard
git clean -df
git clean -Xf
git checkout solution
git pull
git checkout master
git pull

for i in cart catalog inventory monolith; do
    cd $HOME/projects/${i}
    mvn clean
    rm -rf deployments
done

# cleanup any stuff this scenario will create
pkill java || echo "No java running"
rm -rf $HOME/rhamt-reports/monolith $HOME/jboss-eap-7.1

# start in right directory
echo "---"
echo "Reset complete. To start in the right place: cd $HOME/projects/monolith"
echo "---"

