We have already deployed our coolstore monolith to OpenShift, but now we are working on re-architecting it to be
microservices-based.

In this step we will deploy our new Inventory microservice for our CoolStore application,
so let's create a separate project to house it and keep it separate from our monolith and our other microservices we will
create later on.

**1. Create project**

Create a new project for the _inventory_ service:

`oc new-project inventory --display-name="CoolStore Inventory Microservice Application"`{{execute T1 interrupt}}

**3. Open the OpenShift Web Console**

You should be familiar with the OpenShift Web Console by now!
Click on the "OpenShift Console" tab:

![OpenShift Console Tab](/redhat-middleware-workshops/assets/mono-to-micro-part-1/openshift-console-tab.png)

And navigate to the new _inventory_ project overview page (or use [this quick link](https://[[HOST_SUBDOMAIN]]-8443-[[KATACODA_HOST]].environments.katacoda.com/console/project/inventory/)

![Web Console Overview](/redhat-middleware-workshops/assets/mono-to-micro-part-1/overview.png)

There's nothing there now, but that's about to change.

