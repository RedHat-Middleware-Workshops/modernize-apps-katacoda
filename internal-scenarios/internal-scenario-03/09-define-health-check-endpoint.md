We are now ready to define the logic of our health check endpoint.

**1. Create empty Java class**

The logic will be put into a new Java class.

Click this link to create and open the file which will contain the new class: `src/main/java/com/redhat/coolstore/rest/HealthChecks.java`{{open}}

Methods in this new class will be annotated with both the JAX-RS annotations as well as
[WildFly Swarm's `@Health` annotation](https://wildfly-swarm.gitbooks.io/wildfly-swarm-users-guide/content/advanced/monitoring.html), indicating it should be used as a health check endpoint.

**2. Add logic**

Next, let's fill in the class by creating a new RESTful endpoint which will be used by OpenShift to probe our services.

Click on **Copy To Editor** below to implement the logic.

<pre class="file" data-filename="./src/main/java/com/redhat/coolstore/rest/HealthChecks.java" data-target="replace">
package com.redhat.coolstore.rest;

import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.Path;

import com.redhat.coolstore.service.InventoryService;
import org.wildfly.swarm.health.Health;
import org.wildfly.swarm.health.HealthStatus;

@Path("/infra")
public class HealthChecks {

    @Inject
    private InventoryService inventoryService;

    @GET
    @Health
    @Path("/health")
    public HealthStatus check() {

        if (inventoryService.isAlive()) {
            return HealthStatus.named("service-state").up();
        } else {
            return HealthStatus.named("service-state").down();
        }
    }
}
</pre>

The `check()` method exposes an HTTP GET endpoint which will return the status of the service. The logic of
this check does a simple query to the underlying database to ensure the connection to it is stable and available.
The method is also annotated with WildFly Swarm's `@Health` annotation, which directs WildFly Swarm to expose
this endpoint as a health check at `/health`.

With our new health check in place, we'll need to build and deploy the updated application in the next step.
