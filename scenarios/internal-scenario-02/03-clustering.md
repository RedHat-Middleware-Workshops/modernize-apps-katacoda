One really nice feature with the JBoss EAP image is that it out of the box supports clustering. This means that application doesn't have to be re-written to be stateless, but actually in-memory state can be synchronized between different instances.

Let's see this in action.

First let's open the application using [this link](http://coolstore-coolstore-s2i.[[HOST_SUBDOMAIN]]-80-[[KATACODA_HOST]].environments.katacoda.com).

When in the application add a couple of products to the shopping cart.

In the top right corner you can see the calculated value of the products you have added to the shopping cart. You can also click on the cart in the top right corner and see a summary of your shopping cart. Write down the `Total Order Amount` some where so that we can verify it later.

Now let's scale up the cluster

``oc scale --replicas=2 dc coolstore``{{execute T1}}

Open the OpenShift Console and verify that we have 2 running instances. It might take a while!




