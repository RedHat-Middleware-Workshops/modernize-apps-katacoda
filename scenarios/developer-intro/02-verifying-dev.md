In the previous lab you created a new OpenShift project called `coolstore-dev` which represents
your developer personal project in which you deployed the CoolStore monolith.

**1. Verify Application**

Let's take a moment and review the OpenShift resources that are created for the Monolith:

* Build Config: **coolstore** build config is the configuration for building the Monolith
image from the source code or WAR file
* Image Stream: **coolstore** image stream is the virtual view of all coolstore container
images built and pushed to the OpenShift integrated registry.
* Deployment Config: **coolstore** deployment config deploys and redeploys the Coolstore container
image whenever a new coolstore container image becomes available. Similarly, the **coolstore-postgresql**
does the same for the database.
* Service: **coolstore** and **coolstore-postgresql** service is an internal load balancer which identifies a set of
pods (containers) in order to proxy the connections it receives to them. Backing pods can be
added to or removed from a service arbitrarily while the service remains consistently available,
enabling anything that depends on the service to refer to it at a consistent address (service name
or IP).
* Route: **www** route registers the service on the built-in external load-balancer
and assigns a public DNS name to it so that it can be reached from outside OpenShift cluster.

You can review the above resources in the OpenShift Web Console or using the `oc get` or `oc describe` commands
(`oc describe` gives more detailed info):

> You can use short synonyms for long words, like `bc` instead of `buildconfig`,
and `is` for `imagestream`, `dc` for `deploymentconfig`, `svc` for service,
etc.

> **NOTE**: Don't worry about reading and understanding the output of `oc describe`. Just make sure
the command doesn't report errors!

Run these commands to inspect the elements:

`oc get bc coolstore`{{execute}}

`oc get is coolstore`{{execute}}

`oc get dc coolstore`{{execute}}

`oc get svc coolstore`{{execute}}

`oc describe route www`{{execute}}

Verify that you can access the monolith by clicking on the
[exposed OpenShift route](http://www-coolstore-dev.[[HOST_SUBDOMAIN]]-80-[[KATACODA_HOST]].environments.katacoda.com)
to open up the sample application in a separate browser tab.

You should also be able to see both the CoolStore monolith and its database
running in separate pods:

`oc get pods -l application=coolstore`{{execute}}

The output should look like this:

```console
NAME                           READY     STATUS    RESTARTS   AGE
coolstore-2-bpkkc              1/1       Running   0          4m
coolstore-postgresql-1-jpcb8   1/1       Running   0          9m
```

**1. Verify Database**

You can log into the running Postgres container using the following:

`oc --server https://master:8443 rsh dc/coolstore-postgresql`{{execute}}

Once logged in, use the following command to execute an SQL statement to show some content from the database:

`psql -U $POSTGRESQL_USER $POSTGRESQL_DATABASE -c 'select name from PRODUCT_CATALOG;'`{{execute}}

You should see the following:

```console
          name
------------------------
 Red Fedora
 Forge Laptop Sticker
 Solid Performance Polo
 Ogio Caliber Polo
 16 oz. Vortex Tumbler
 Atari 2600 Joystick
 Pebble Smart Watch
 Oculus Rift
 Lytro Camera
(9 rows)```

Don't forget to exit the pod's shell with `exit`{{execute}}

With our running project on OpenShift, in the next step we'll explore how you as a developer can work with the running app
to make changes and debug the application!

