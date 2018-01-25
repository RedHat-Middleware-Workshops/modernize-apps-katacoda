WildFly Swarm uses JAX-RS standard for building REST services. Create a new Java class named
`InventoryEndpoint.java` in `com.redhat.coolstore.rest` package with the following
content by clicking on *Copy to Editor*:

<pre class="file" data-filename="./src/main/java/com/redhat/coolstore/rest/InventoryEndpoint.java" data-target="replace">
package com.redhat.coolstore.rest;

import java.io.Serializable;
import java.util.List;

import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import com.redhat.coolstore.model.Inventory;
import com.redhat.coolstore.service.InventoryService;

@RequestScoped
@Path("/inventory")
public class InventoryEndpoint implements Serializable {

    private static final long serialVersionUID = -7227732980791688773L;

    @Inject
    private InventoryService inventoryService;

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public List<Inventory> getAll() {
        return inventoryService.getAllInventory();
    }

    @GET
    @Path("{itemId}")
    @Produces(MediaType.APPLICATION_JSON)
    public Inventory getAvailability(@PathParam("itemId") String itemId) {
        return inventoryService.getInventory(itemId);
    }

}

</pre>

The above REST services defines two endpoints:

* `/services/inventory` that is accessible via **HTTP GET** which will return all known product Inventory entities as JSON
* `/services/inventory/<id>` that is accessible via **HTTP GET** at
for example **/services/inventory/329299** with
the last path parameter being the product id which we want to check its inventory status.

The code also injects our new **InventoryService** using the [CDI @Inject](https://docs.oracle.com/javaee/7/tutorial/partcdi.htm) annotation, which gives
us a runtime handle to the service we defined in the previous steps that we can use to query
the database when the RESTful APIs are invoked.

Build and package the Inventory service again using Maven:

`mvn clean package`{{execute}}

You should see a **BUILD SUCCESS** in the build logs.
