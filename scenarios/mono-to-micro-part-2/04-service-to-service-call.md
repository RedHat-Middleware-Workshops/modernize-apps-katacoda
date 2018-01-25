So far our application has been kind of straight forward, but our monolith code for the catalog is also returning the inventory status. In the monolith since both the inventory data and catalog data is in the same database we used a OneToOne mapping in JPA like this:

```
@OneToOne(cascade = CascadeType.ALL,fetch=FetchType.EAGER)
@PrimaryKeyJoinColumn
private InventoryEntity inventory;
```
When redesigning our application to Microservices using domain driven design we have identified that Inventory and ProductCatalog are two separate domains. However our current UI expects to retrieve data from both the Catalog Service and Inventory service in a singe request.

**Service interaction**

Our problem is that the user interface requires data from two services when calling the REST service on `/services/products`. There are multiple ways to solve this like:

1. **Client Side integration** - We could extend our UI to first call `/services/products` and then for each product item call `/services/inventory/{prodId}` to get the inventory status and then combine the result in the web browser. This would be the least intrusive method, but it also means that if we have 100 of products the client will make 101 request to the server. If we have a slow internet connection this may cause issues. 
2. **Microservices Gateway** - Creating a gateway in-front of the `Catalog Service` that first calls the Catalog Service and then based on the response calls the inventory is another option. This way we can avoid lots of calls from the client to the server. Apache Camel provides nice capabilities to do this and if you are interested to learn more about this, please checkout the Coolstore Microservices example [here](http://github.com/jbossdemocentral/coolstore-microservice)
3. **Service-to-Service** - Depending on use-case and preferences another solution would be to do service-to-service calls instead. In our case means that the Catalog Service would call the Inventory service using REST to retrieve the inventory status and include that in the response.

There are no right or wrong answers here, but since this is a workshop on application modernization using RHOAR runtimes we will not choose option 1 or 2 here. Instead we are going to use option 3 and extend our Catalog to call the Inventory service. 

## Extending the test

In the [Test-Driven Development](https://en.wikipedia.org/wiki/Test-driven_development) style, let's first extend our test to test the Inventory functionality (which doesn't exist). 

Open ``src/test/java/com/redhat/coolstore/service/CatalogEndpointTest.java``{{open}} again.

Now at the markers `//TODO: Add check for Quantity` add the following line:

<pre class="file" data-filename="src/test/java/com/redhat/coolstore/service/CatalogEndpointTest.java" data-target="insert" data-marker="//TODO: Add check for Quantity">
.returns(9999,Product::getQuantity)
</pre>

And add it to the second test as well:

<pre class="file" data-filename="src/test/java/com/redhat/coolstore/service/CatalogEndpointTest.java" data-target="insert" data-marker="//TODO: Add check for Quantity">
.returns(9999,Product::getQuantity)
</pre>

Now if we run the test it **should fail**!

``mvn verify``{{execute T1 interrupt}}

It failed:

```console
Tests run: 4, Failures: 2, Errors: 0, Skipped: 0

[INFO] ------------------------------------------------------------------------
[INFO] BUILD FAILURE
[INFO] ------------------------------------------------------------------------
```

Again the test fails because we are trying to call the Inventory service which is not running. We will soon implement the code to call the inventory service, but first
we need a away to test this service without having to really on the inventory services to be up an running. For that we are going to use an API Simulator
called [HoverFly](http://hoverfly.io) and particular it's capability to simulate remote APIs. HoverFly is very convenient to use with Unit test and all we have to do is
to add a `ClassRule` that will simulate all calls to inventory like this (click to add):

<pre class="file" data-filename="src/test/java/com/redhat/coolstore/service/CatalogEndpointTest.java"
data-target="insert" data-marker="//TODO: Add ClassRule for HoverFly Inventory simulation">
@ClassRule
public static HoverflyRule hoverflyRule = HoverflyRule.inSimulationMode(dsl(
        service("inventory:8080")
//                    .andDelay(2500, TimeUnit.MILLISECONDS).forMethod("GET")
                .get(startsWith("/services/inventory"))
//                    .willReturn(serverError())
                .willReturn(success(json(new Inventory("9999",9999))))

));
</pre>

This `ClassRule` means that if our tests are trying to call our inventory url Howeverfly will intercept this and respond with our hard coded response instead.

**Implementing the Inventory Client**

Since we now have a nice way to test our service-to-service interaction we can now create the client that calls the Inventory. Netflix has provided some nice extensions to the Spring Framework that are mostly captured in the Spring Cloud project, however Spring Cloud is mainly focused on Pivotal Cloud Foundry and because of that Red Hat and others have contributed Spring Cloud Kubernetes to the Spring Cloud project, which enables the same functionallity for Kubernetes based platforms like OpenShift. 

The inventory client will use a Netflix project called Feign, which provides a nice way to avoid having to write boiler plate code. Feign also integrate with Hystrix which gives us capability to Circute Break calls that doesn't work. We will discuss this more later, but let's start with the implementation of the Inventry Client. Using Feign all we have todo is to create a interface that details which parameters and return type we expect, annotate it with @RequestMapping and provide some details and then annotate the interface with @Feign and provide it with a name.

Create the Inventory client by clicking ``src/main/java/com/redhat/coolstore/client/InventoryClient.java``{{open}}

Add the followng small code snippet to it (click to add):

<pre class="file" data-filename="src/main/java/com/redhat/coolstore/client/InventoryClient.java" data-target="replace">
package com.redhat.coolstore.client;

import com.redhat.coolstore.model.Inventory;
import feign.hystrix.FallbackFactory;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.cloud.netflix.feign.FeignClient;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@FeignClient(name="inventory")
public interface InventoryClient {

    @RequestMapping(method = RequestMethod.GET, value = "/services/inventory/{itemId}", consumes = {MediaType.APPLICATION_JSON_VALUE})
    Inventory getInventoryStatus(@PathVariable("itemId") String itemId);

//TODO: Add Fallback factory here
}
</pre>

There is one more thing that we need to do which is to tell Feign where the inventory service is running. Before that notice that we are setting the `@FeignClient(name="inventory")`.

Open ``src/main/resources/application-default.properties``{{open}}

And add these properties by clicking **Copy to Editor**:

<pre class="file" data-filename="src/main/resources/application-default.properties" data-target="insert" data-marker="#TODO: Configure netflix libraries">
inventory.ribbon.listOfServers=inventory:8080
feign.hystrix.enabled=true
</pre>
 
By setting inventory.ribbon.listOfServers we are hard coding the actual URL of the service to `inventory:8080`. If we had multiple servers we could also add those using a comma. However using Kubernetes there is no need to have multiple endpoints listed here since Kubernetes has a concept of _Services_ that will internally route between multiple instances of the same service. Later on we will update this value to reflect our URL when deploying to OpenShift.


Now that we have a client we can make use of it in our `CatalogService`

Open ``src/main/java/com/redhat/coolstore/service/CatalogService.java``{{open}}

And autowire (e.g. inject) the client into it. 

<pre class="file" data-filename="src/main/java/com/redhat/coolstore/service/CatalogService.java" data-target="insert" data-marker="//TODO: Autowire Inventory Client">
@Autowired
InventoryClient inventoryClient;
</pre>

Next, update the `read(String id)` method at the comment `//TODO: Update the quantity for the product by calling the Inventory service` add the following:

<pre class="file" data-filename="src/main/java/com/redhat/coolstore/service/CatalogService.java" data-target="insert" data-marker="//TODO: Update the quantity for the product by calling the Inventory service">
product.setQuantity(inventoryClient.getInventoryStatus(product.getItemId()).getQuantity());
</pre>

Also, don't forget to add the import statement for the new class:

<pre class="file" data-filename="src/main/java/com/redhat/coolstore/service/CatalogService.java" data-target="insert" data-marker="//import com.redhat.coolstore.client.InventoryClient;">
import com.redhat.coolstore.client.InventoryClient;
</pre>

Also in the `readAll()` method replace the comment `//TODO: Update the quantity for the products by calling the Inventory service` with the following:
<pre class="file" data-filename="src/main/java/com/redhat/coolstore/service/CatalogService.java" data-target="insert" data-marker="//TODO: Update the quantity for the products by calling the Inventory service">
productList.parallelStream()
            .forEach(p -&gt; {
                p.setQuantity(inventoryClient.getInventoryStatus(p.getItemId()).getQuantity());
            });
</pre>

>**NOTE:** The lambda expression to update the product list uses a `parallelStream`, which means that it will process the inventory calls asynchronously, which will be much faster than using synchronous calls. Optionally when we run the test you can test with both `parallelStream()` and `stream()` just to see the difference in how long the test takes to run.

We are now ready to test the service

``mvn verify``{{execute}}

So even if we don't have any inventory service running we can still run our test. However to actually run the service using `mvn spring-boot:run` we need to have an inventory service or the calls to `/services/products/` will fail. We will fix this in the next step

## Congratulations
You now have the framework for retrieving products from the product catalog and enriching the data with inventory data from
an external service. But what if that external inventory service does not respond? That's the topic for the next step.
