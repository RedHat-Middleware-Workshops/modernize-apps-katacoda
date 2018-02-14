In this step we will mirror the abstraction of a _service_ so that we can inject the Inventory _service_ into
various places (like a RESTful resource endpoint) in the future. This is the same approach that our monolith
uses, so we can re-use this idea again. Create an **InventoryService** class in the
`com.redhat.coolstore.service` package by clicking **Copy To Editor** with the below code:

<pre class="file" data-filename="./src/main/java/com/redhat/coolstore/service/InventoryService.java" data-target="replace">
package com.redhat.coolstore.service;


import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;

import com.redhat.coolstore.model.Inventory;

import java.util.Collection;
import java.util.List;

@Stateless
public class InventoryService {

    @PersistenceContext
    private EntityManager em;

    public InventoryService() {

    }

    public boolean isAlive() {
        return em.createQuery("select 1 from Inventory i")
                .setMaxResults(1)
                .getResultList().size() == 1;
    }
    public Inventory getInventory(String itemId) {
        return em.find(Inventory.class, itemId);
    }

    public List<Inventory> getAllInventory() {
        Query query = em.createQuery("SELECT i FROM Inventory i");
        return query.getResultList();
    }
}
</pre>

Review the **InventoryService** class and note the EJB and JPA annotations on this class:

* **@Stateless** marks
the class as a _Stateless EJB_, and its name suggests, means that instances of the class do not maintain state,
which means they can be created and destroyed at will by the management system, and be re-used by multiple clients
without instantiating multiple copies of the bean. Because they can support multiple
clients, stateless EJBs can offer better scalability for applications that require large numbers of
clients.

* **@PersistenceContext** objects are created by the Java EE server based on the JPA definition in `persistence.xml` that
we examined earlier, so to use it at runtime it is injected by this annotation and can be used to issue queries against
the underlying database backing the **Inventory** entities.

This service class exposes a few APIs that we'll use later:

* **isAlive()** - A simple health check to determine if this service class is ready to accept requests. We will use
this later on when defining OpenShift health checks.

* **getInventory()** and **getAllInventory()** are APIs used to query for one or all of the stored **Inventory* entities. We'll use this
later on when implementing a RESTful endpoint.

Re-Build and package the Inventory service using Maven to make sure your code compiles:

`mvn clean package`{{execute}}

You should see a **BUILD SUCCESS** in the build logs. If builds successfully, continue to the next step to
create a new RESTful endpoint that uses this service.
