We have already deployed our coolstore monolith and inventory to OpenShift. In this step we will deploy our new Catalog microservice for our CoolStore application,
so let's create a separate project to house it and keep it separate from our monolith and our other microservices.

**1. Create project**

Create a new project for the *catalog* service:

```oc new-project catalog --display-name="CoolStore Catalog Microservice Application"```{{execute interrupt}}

Next, we'll deploy your new microservice to OpenShift.