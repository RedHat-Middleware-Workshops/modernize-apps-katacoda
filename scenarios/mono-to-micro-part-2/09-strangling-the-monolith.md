So far we haven't started [strangling the monolith](https://www.martinfowler.com/bliki/StranglerApplication.html). To do this
we are going to make use of routing capabilities in OpenShift. Each external request coming into OpenShift (unless using
ingress, which we are not) will pass through a route. In our monolith the web page uses client side REST calls to load
different parts of pages.

For the home page the product list is loaded via a REST call to *http://<monolith-hostname>/services/products*. At the moment
calls to that URL will still hit product catalog in the monolith. By using a
[path based route](https://docs.openshift.com/container-platform/3.7/architecture/networking/routes.html#path-based-routes) in
OpenShift we can route these calls to our newly created catalog services instead and end up with something like:

![Greeting](/redhat-middleware-workshops/assets/mono-to-micro-part-2/goal.png)


Flow the steps below to create a path based route.

**1. Obtain hostname of monolith UI from our Dev environment**

`oc get route/www -n coolstore-dev`{{execute T1}}

The output of this command shows us the hostname:

```console
NAME      HOST/PORT                                 PATH      SERVICES    PORT      TERMINATION   WILDCARD
www       www-coolstore-dev.apps.127.0.0.1.nip.io             coolstore   <all>                   None
```

My hostname is `www-coolstore-dev.apps.127.0.0.1.nip.io` but **yours will be different**.

**2. Open the openshift console for [Catalog - Applications - Routes](https://[[HOST_SUBDOMAIN]]-8443-[[KATACODA_HOST]].environments.katacoda.com/console/project/catalog/browse/routes)**

**3. Click on Create Route, and set**

* **Name**: `catalog-redirect`
* **Hostname**: _the hostname from above_
* **Path**: `/services/products`
* **Service**: `catalog`

![Greeting](/redhat-middleware-workshops/assets/mono-to-micro-part-2/route-vals.png)

Leave other values set to their defaults, and click **Save**

**4. Test the route**

Test the route by running `curl http://www-coolstore-dev.[[HOST_SUBDOMAIN]]-80-[[KATACODA_HOST]].environments.katacoda.com/services/products`{{execute}}

You should get a complete set of products, along with their inventory.

**5. Test the UI**

[Open the monolith UI](http://www-coolstore-dev.[[HOST_SUBDOMAIN]]-80-[[KATACODA_HOST]].environments.katacoda.com)
and observe that the new catalog is being used along with the monolith:

![Greeting](/redhat-middleware-workshops/assets/mono-to-micro-part-2/coolstore-web.png)

The screen will look the same, but notice that the earlier product *Atari 2600 Joystick* is now gone,
as it has been removed in our new catalog microservice.

## Congratulations!

You have now successfully begun to _strangle_ the monolith. Part of the monolith's functionality (Inventory and Catalog) are
now implemented as microservices, without touching the monolith. But there's a few more things left to do, which we'll do in the
next steps.
