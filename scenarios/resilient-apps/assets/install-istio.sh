#!/usr/bin/env bash

ISTIO_VERSION=0.4.0
ISTIO_HOME=${HOME}/istio-${ISTIO_VERSION}

# shut down previous labs if needed
oc get -n coolstore-dev dc/coolstore >& /dev/null && oc scale --replicas=0 dc/coolstore dc/coolstore-postgresql -n coolstore-dev ; \
oc get -n coolstore-prod dc/coolstore-prod >& /dev/null && oc scale --replicas=0 dc/coolstore-prod dc/coolstore-postgresql -n coolstore-prod ; \
oc get -n inventory dc/inventory >& /dev/null && oc scale --replicas=0 dc/inventory dc/inventory-database -n inventory ; \
oc get -n catalog dc/catalog >& /dev/null && oc scale --replicas=0 dc/catalog dc/catalog-database -n catalog ; \
oc get -n cart dc/cart >& /dev/null && oc scale --replicas=0 dc/cart -n cart

# install istio
curl -kL https://git.io/getLatestIstio | sed 's/curl/curl -k /g' | ISTIO_VERSION=${ISTIO_VERSION} sh -
export PATH="$PATH:${ISTIO_HOME}/bin"
cd ${ISTIO_HOME}

# workaround bug
sed -i 's/mtlsExcludedServices/#mtlsExcludedServices/' install/kubernetes/istio.yaml

oc new-project istio-system
oc adm policy add-scc-to-user anyuid -z istio-ingress-service-account
oc adm policy add-scc-to-user privileged -z istio-ingress-service-account
oc adm policy add-scc-to-user anyuid -z istio-egress-service-account
oc adm policy add-scc-to-user privileged -z istio-egress-service-account
oc adm policy add-scc-to-user anyuid -z istio-pilot-service-account
oc adm policy add-scc-to-user privileged -z istio-pilot-service-account
oc adm policy add-scc-to-user anyuid -z default
oc adm policy add-scc-to-user privileged -z default
oc adm policy add-cluster-role-to-user cluster-admin -z default
oc apply -f install/kubernetes/istio.yaml
oc create -f install/kubernetes/addons/prometheus.yaml
oc create -f install/kubernetes/addons/grafana.yaml
oc create -f install/kubernetes/addons/servicegraph.yaml
oc apply -f https://raw.githubusercontent.com/jaegertracing/jaeger-kubernetes/master/all-in-one/jaeger-all-in-one-template.yml
oc expose svc grafana
oc expose svc servicegraph
oc expose svc jaeger-query
oc expose svc istio-ingress
oc expose svc prometheus
