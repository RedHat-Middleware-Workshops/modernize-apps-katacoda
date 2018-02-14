Let's deploy our new inventory microservice to OpenShift!

**1. Deploy the Database**

Our production inventory microservice will use an external database (PostgreSQL) to house inventory data.
First, deploy a new instance of PostgreSQL by executing:

`oc new-app -e POSTGRESQL_USER=inventory \
             -e POSTGRESQL_PASSWORD=mysecretpassword \
             -e POSTGRESQL_DATABASE=inventory \
             openshift/postgresql:latest \
             --name=inventory-database`{{execute T1}}

> **NOTE:** If you change the username and password you also need to update `src/main/fabric8/credential-secret.yml`{{open}} which contains
the credentials used when deploying to OpenShift.

This will deploy the database to our new project. Wait for it to complete:

`oc rollout status -w dc/inventory-database`{{execute T1}}

**2. Build and Deploy**

Red Hat OpenShift Application Runtimes includes a powerful maven plugin that can take an
existing WildFly Swarm application and generate the necessary Kubernetes configuration.
You can also add additional config, like ``src/main/fabric8/inventory-deployment.yml``{{open}} which defines
the deployment characteristics of the app (in this case we declare a few environment variables which map our credentials
stored in the secrets file to the application), but OpenShift supports a wide range of [Deployment configuration options](https://docs.openshift.org/latest/architecture/core_concepts/deployments.html) for apps).

Build and deploy the project using the following command, which will use the maven plugin to deploy:

`mvn clean fabric8:deploy -Popenshift`{{execute T1}}

The build and deploy may take a minute or two. Wait for it to complete. You should see a **BUILD SUCCESS** at the
end of the build output.

> **NOTE**: If you see messages like `Current reconnect backoff is 2000 milliseconds (T1)` you can safely
ignore them, it is a known issue and is harmless.

After the maven build finishes it will take less than a minute for the application to become available.
To verify that everything is started, run the following command and wait for it complete successfully:

`oc rollout status -w dc/inventory`{{execute T1}}

>**NOTE:** Even if the rollout command reports success the application may not be ready yet and the reason for
that is that we currently don't have any liveness check configured, but we will add that in the next steps.

**3. Access the application running on OpenShift**

This sample project includes a simple UI that allows you to access the Inventory API. This is the same
UI that you previously accessed outside of OpenShift which shows the CoolStore inventory. Click on the
[route URL](http://inventory-inventory.[[HOST_SUBDOMAIN]]-80-[[KATACODA_HOST]].environments.katacoda.com)
to access the sample UI.

> You can also access the application through the link on the OpenShift Web Console Overview page.

![Overview link](/redhat-middleware-workshops/assets/mono-to-micro-part-1/routelink.png)

> **NOTE**: If you get a '404 Not Found' error, just reload the page a few times until the Inventory UI appears. This
is due to a lack of health check which you are about to fix!

The UI will refresh the inventory table every 2 seconds, as before.

Back on the OpenShift console, Navigate to _Applications_ -> _Deployments_ -> `inventory` (or just click [this link](https://[[HOST_SUBDOMAIN]]-8443-[[KATACODA_HOST]].environments.katacoda.com/console/project/inventory/browse/dc/inventory?tab=history) ) and then click on
the top-most `(latest)` deployment in the listing (most likely `#1` or `#2`):

![Overview link](/redhat-middleware-workshops/assets/mono-to-micro-part-1/deployment-list.png)

Notice OpenShift is warning you that the inventory application has no health checks:

![Health Check Warning](/redhat-middleware-workshops/assets/mono-to-micro-part-1/warning.png)

In the next steps you will enhance OpenShift's ability to manage the application lifecycle by implementing
a _health check pattern_. By default, without health checks (or health _probes_) OpenShift considers services
to be ready to accept service requests even before the application is truly ready or if the application is hung
or otherwise unable to service requests. OpenShift must be _taught_ how to recognize that our app is alive and ready
to accept requests. 

