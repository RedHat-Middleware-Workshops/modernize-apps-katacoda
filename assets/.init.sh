#!/usr/bin/env bash
echo "Running init commands" |& tee ${HOME}/.init.log


if [ ! -f /opt/katacoda-completed ]; then
  printf "Waiting for the Environment to start" | tee -a ${HOME}/.init.log
  while [ ! -f /opt/katacoda-completed ]; do printf "." | tee -a ${HOME}/.init.log; sleep 3; done
fi

echo "The currently logged in to OpenShift as  $(oc whoami)" |& tee -a ${HOME}/.init.log
if [ "$(oc whoami)" == "system:admin" ]; then
  # Clean out extra directories that will cause the report generation to fail
  find /root/rhamt-cli-4.0.0.Beta4 -name \*\._\* -print | xargs rm -f |& tee -a ${HOME}/.init.log
  
  echo "Adding Policy rules" |& tee -a ${HOME}/.init.log
  oc adm policy add-role-to-user system:image-puller system:anonymous |& tee -a ${HOME}/.init.log
  oc adm policy add-cluster-role-to-user cluster-admin admin |& tee -a ${HOME}/.init.log
  oadm policy add-cluster-role-to-user sudoer developer |& tee -a ${HOME}/.init.log

  oc import-image jenkins:v3.7 --from='registry.access.redhat.com/openshift3/jenkins-2-rhel7:v3.7' --confirm -n openshift |& tee -a ${HOME}/.init.log
  oc export template jenkins-persistent -n openshift -o json | sed 's/jenkins:latest/jenkins:v3.7/g' | oc replace -f - -n openshift |& tee -a ${HOME}/.init.log
  oc export template jenkins-ephemeral -n openshift -o json | sed 's/jenkins:latest/jenkins:v3.7/g' | oc replace -f - -n openshift  |& tee -a ${HOME}/.init.log

  echo "Installing template" |& tee -a ${HOME}/.init.log
  oc create -n openshift -f https://raw.githubusercontent.com/RedHat-Middleware-Workshops/modernize-apps-labs/master/monolith/src/main/openshift/template-binary.json |& tee -a ${HOME}/.init.log
  oc create -n openshift -f https://raw.githubusercontent.com/RedHat-Middleware-Workshops/modernize-apps-labs/master/monolith/src/main/openshift/template-prod.json |& tee -a ${HOME}/.init.log

  echo "Disable namespace ownership for router" |& tee -a ${HOME}/.init.log
  oc env dc/router ROUTER_DISABLE_NAMESPACE_OWNERSHIP_CHECK=true -n default |& tee -a ${HOME}/.init.log

  echo "Logging in as developer" |& tee -a ${HOME}/.init.log
  MASTER_EXTERNAL_URL=$(oc get route/docker-registry -n default | grep -v NAME | awk '{print $2}' | sed 's/docker\-registry\-default\.//' | sed 's/\-80\-/\-8443\-/')
  echo "Using $MASTER_EXTERNAL_URL as the server" |& tee -a ${HOME}/.init.log
  oc login $MASTER_EXTERNAL_URL -u developer -p developer --insecure-skip-tls-verify=true |& tee -a ${HOME}/.init.log

  echo "Starting nginx RHAMT report server..." |& tee -a ${HOME}/.init.log
  mkdir -p ${HOME}/rhamt-reports
  NGINX_CID=$(docker run --detach --privileged -v ${HOME}/rhamt-reports:/usr/share/nginx/html:ro,z -p 9000:80 nginx)
  echo "Started nginx. Container ID ${NGINX_CID}" |& tee -a ${HOME}/.init.log

  echo "Ensuring some images are pre-pulled" |& tee -a ${HOME}/.init.log
  docker pull registry.access.redhat.com/openshift3/jenkins-2-rhel7:v3.7 |& tee -a ${HOME}/.init.log
  docker pull registry.access.redhat.com/openshift3/jenkins-2-rhel7:latest |& tee -a ${HOME}/.init.log
  docker pull registry.access.redhat.com/jboss-eap-7/eap70-openshift:1.6 |& tee -a ${HOME}/.init.log
  docker pull nginx:latest |& tee -a ${HOME}/.init.log


elif [ "$(oc whoami)" == "admin" ]; then
  echo "Already logged in as admin. Switching to developer"
  MASTER_EXTERNAL_URL=$(oc get route/docker-registry -n default | grep -v NAME | awk '{print $2}' | sed 's/docker\-registry\-default\.//' | sed 's/\-80\-/\-8443\-/')
  oc login $MASTER_EXTERNAL_URL -u developer -p developer --insecure-skip-tls-verify=true |& tee -a ${HOME}/.init.log
else
  echo "Skipping init since user is not system:admin anymore." |& tee -a ${HOME}/.init.log
fi

echo "Checking out the latest version of the git projects" |& tee -a ${HOME}/.init.log
git --git-dir=/root/projects/.git --work-tree=/root/projects pull |& tee -a ${HOME}/.init.log

echo "Importing images" |& tee -a ${HOME}/.init.log
for is in {"registry.access.redhat.com/jboss-eap-7/eap70-openshift","registry.access.redhat.com/rhscl/postgresql-94-rhel7","registry.access.redhat.com/redhat-openjdk-18/openjdk18-openshift"}
do 
  oc import-image $is --all --confirm --as=system:admin |& tee -a ${HOME}/.init.log
done

echo "Done!" |& tee -a ${HOME}/.init.log
