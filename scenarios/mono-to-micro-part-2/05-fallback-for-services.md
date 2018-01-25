In the previous step we added a client to call the Inventory service. Services calling services is a common practice in Microservices Architecture, but as we add more and more services the likelihood of a problem increases dramatically. Even if each service has 99.9% update, if we have 100 of services our estimated up time will only be ~90%. We therefor need to plan for failures to happen and our application logic has to consider that dependent services are not responding.

In the previous step we used the Feign client from the Netflix cloud native libraries to avoid having to write
boilerplate code for doing a REST call. However Feign also have another good property which is that we easily create
fallback logic. In this case we will use static inner class since we want the logic for the fallback to be part of the
Client and not in a separate class.

Open: ``src/main/java/com/redhat/coolstore/client/InventoryClient.java``{{open}}

And paste:

<pre class="file" data-filename="src/main/java/com/redhat/coolstore/client/InventoryClient.java"
data-target="insert" data-marker="//TODO: Add Fallback factory here">
@Component
static class InventoryClientFallbackFactory implements FallbackFactory&lt;InventoryClient&gt; {
    @Override
    public InventoryClient create(Throwable cause) {
        return new InventoryClient() {
            @Override
            public Inventory getInventoryStatus(@PathVariable("itemId") String itemId) {
                return new Inventory(itemId,-1);
            }
        };
    }
}

</pre>

After creating the fallback factory all we have todo is to tell Feign to use that fallback in case of an issue, by adding the fallbackFactory property to the `@FeignClient` annotation. Click **Copy To Editor** to replace
it for you:

<pre class="file" data-filename="src/main/java/com/redhat/coolstore/client/InventoryClient.java"
data-target="insert" data-marker="@FeignClient(name=&quot;inventory&quot;)">
@FeignClient(name="inventory",fallbackFactory = InventoryClient.InventoryClientFallbackFactory.class)
</pre>

**Test the Fallback**

Now let's see if we can test the fallback. Optimally we should create a different test that fails the request and then verify the fallback value, however in because we are limited in time we are just going to change our test so that it returns a server error and then verify that the test fails. 

Open ``src/test/java/com/redhat/coolstore/service/CatalogEndpointTest.java``{{open}} and change the following lines:

```
@ClassRule
public static HoverflyRule hoverflyRule = HoverflyRule.inSimulationMode(dsl(
        service("inventory:8080")
//                    .andDelay(2500, TimeUnit.MILLISECONDS).forMethod("GET")
                .get(startsWith("/services/inventory"))
//                    .willReturn(serverError())
                .willReturn(success(json(new Inventory("9999",9999))))

));
```

TO

```
@ClassRule
public static HoverflyRule hoverflyRule = HoverflyRule.inSimulationMode(dsl(
        service("inventory:8080")
//                    .andDelay(2500, TimeUnit.MILLISECONDS).forMethod("GET")
                .get(startsWith("/services/inventory"))
                .willReturn(serverError())
//                    .willReturn(success(json(new Inventory("9999",9999))))

));
```
Notice that the Hoverfly Rule will now return serverError for all request to inventory.

Now if you run ``mvn verify -Dtest=CatalogEndpointTest``{{execute}} the test will fail with the following error message:

`Failed tests:   test_retriving_one_proudct(com.redhat.coolstore.service.CatalogEndpointTest): expected:<[9999]> but was:<[-1]>`

So since even if our inventory service fails we are still returning inventory quantity -1. The test fails because we are expecting the quantity to be 9999.

Change back the class rule so that we don't fail the tests like this:
```
@ClassRule
public static HoverflyRule hoverflyRule = HoverflyRule.inSimulationMode(dsl(
        service("inventory:8080")
//                    .andDelay(2500, TimeUnit.MILLISECONDS).forMethod("GET")
                .get(startsWith("/services/inventory"))
//                    .willReturn(serverError())
                .willReturn(success(json(new Inventory("9999",9999))))

));
```

Make sure the test works again by running ``mvn verify -Dtest=CatalogEndpointTest``{{execute}}

**Slow running services**
Having fallbacks is good but that also requires that we can correctly detect when a dependent services isn't responding correctly. Besides from not responding a service can also respond slowly causing our services to also respond slow. This can lead to cascading issues that is hard to debug and pinpoint issues with. We should therefore also have sane defaults for our services. You can add defaults by adding it to the configuration.

Open ``src/main/resources/application-default.properties``{{open}}

<pre class="file" data-filename="src/main/resources/application-default.properties" data-target="insert" data-marker="#TODO: Set timeout to for inventory to 500ms">
hystrix.command.inventory.execution.isolation.thread.timeoutInMilliseconds=500
</pre>

Open ``src/test/java/com/redhat/coolstore/service/CatalogEndpointTest.java``{{open}} and un-comment the `.andDelay(2500, TimeUnit.MILLISECONDS).forMethod("GET")`

Now if you run ``mvn verify -Dtest=CatalogEndpointTest``{{execute}} the test will fail with the following error message:

`Failed tests:   test_retriving_one_proudct(com.redhat.coolstore.service.CatalogEndpointTest): expected:<[9999]> but was:<[-1]>`

This shows that the timeout works nicely. However, since we want our test to be successful **you should now comment out** `.andDelay(2500, TimeUnit.MILLISECONDS).forMethod("GET")` again and then verify that the test works by executing:

``mvn verify -Dtest=CatalogEndpointTest``{{execute}}

## Congratulations
You have now successfully executed the fifth step in this scenario.

In this step you've learned how to add Fallback logic to your class and how to add timeout to service calls. 

In the next step we now test our service locally before we deploy it to OpenShift.

