In earlier scenarios we started [strangling the monolith](https://www.martinfowler.com/bliki/StranglerApplication.html) by redirecting
calls the product catalog microservice. We will now do the same with our new shopping cart microservice. To do this
we are going to again make use of routing capabilities in OpenShift.

Adding items to, or removing items from your cart in the monolith UI is accomplished via a REST call to `http://<monolith-hostname>/services/cart`. At the moment
calls to that URL will still hit embedded cart service in the monolith. By using a
[path based route](https://docs.openshift.com/container-platform/3.7/architecture/networking/routes.html#path-based-routes) in
OpenShift we can route these calls to our newly created cart services instead, just like we did with the Catalog microservice!

Flow the steps below to create a path based route.

**1. Obtain hostname of monolith UI from our Dev environment**

`oc get route/www -n coolstore-dev`{{execute T1}}

The output of this command shows us the hostname:

```console
NAME      HOST/PORT                                 PATH      SERVICES    PORT      TERMINATION   WILDCARD
www       www-coolstore-dev.apps.127.0.0.1.nip.io             coolstore   <all>                   None
```

My hostname is `www-coolstore-dev.apps.127.0.0.1.nip.io` but **yours will be different**.

**2. Open the openshift console for [Cart - Applications - Routes](https://[[HOST_SUBDOMAIN]]-8443-[[KATACODA_HOST]].environments.katacoda.com/console/project/cart/browse/routes)**

**3. Click on Create Route, and set**

* **Name**: `cart-redirect`
* **Hostname**: _the hostname from above_
* **Path**: `/services/cart`
* **Service**: `cart`

![Greeting](/redhat-middleware-workshops/assets/reactive-microservices/route-vals.png)

Leave other values set to their defaults, and click **Save**

**4. Test the route**

Test the route by running `curl http://www-coolstore-dev.[[HOST_SUBDOMAIN]]-80-[[KATACODA_HOST]].environments.katacoda.com/services/cart/99999`{{execute}}

You should get a complete set of products, along with their inventory.

**5. Test the UI**

Open the monolith UI and observe that the new catalog is being used along with the monolith:

![Greeting](/redhat-middleware-workshops/assets/mono-to-micro-part-2/coolstore-web.png)

Add some items to your cart, then visit the **Shopping Cart** tab to observe the new shipping fees we hard-coded earlier:

![Greeting](/redhat-middleware-workshops/assets/reactive-microservices/fees.png)

The **Checkout** functionality is yet to be implemented, so won't work, but it's not too far away and if you have time
after this workshop feel free to contribute the changes and make this workshop even better!

## Congratulations!

You have now successfully begun to _strangle_ the monolith. Part of the monolith's functionality (Inventory, Catalog and Shopping Cart) are
now implemented as microservices, without touching the monolith.