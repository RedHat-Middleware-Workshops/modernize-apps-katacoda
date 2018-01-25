With our skeleton project in place, let's get to work defining the business logic.

The first step is to define the model (definition) of an Inventory object. Since WildFly Swarm uses JPA,
we can re-use the same model definition from our monolithic application - no need to re-write or re-architect!

Create a new Java class named `Inventory.java` in
`com.redhat.coolstore.model` package with the following code, identical to the monolith code (click **Copy To Editor** to create the class):

<pre class="file" data-filename="./src/main/java/com/redhat/coolstore/model/Inventory.java" data-target="replace">
package com.redhat.coolstore.model;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;
import java.io.Serializable;

@Entity
@Table(name = "INVENTORY", uniqueConstraints = @UniqueConstraint(columnNames = "itemId"))
public class Inventory implements Serializable {

    private static final long serialVersionUID = -7304814269819778382L;

    @Id
    private String itemId;


    private String location;


    private int quantity;


    private String link;

    public Inventory() {

    }

    public Inventory(String itemId, int quantity, String location, String link) {
        super();
        this.itemId = itemId;
        this.quantity = quantity;
        this.location = location;
        this.link = link;
    }

    public String getItemId() {
		return itemId;
	}

	public void setItemId(String itemId) {
		this.itemId = itemId;
	}

	public String getLocation() {
		return location;
	}

	public void setLocation(String location) {
		this.location = location;
	}

	public int getQuantity() {
		return quantity;
	}

	public void setQuantity(int quantity) {
		this.quantity = quantity;
	}

	public String getLink() {
		return link;
	}

	public void setLink(String link) {
		this.link = link;
	}

	@Override
    public String toString() {
        return "Inventory [itemId=" + itemId + ", availability=" + quantity + "/" + location + " link=" + link + "]";
    }
}

</pre>

Review the **Inventory** domain model and note the JPA annotations on this class. **@Entity** marks
the class as a JPA entity, **@Table** customizes the table creation process by defining a table
name and database constraint and **@Id** marks the primary key for the table.

WildFly Swarm configuration is done to a large extent through detecting the intent of the
developer and automatically adding the required dependencies configurations to make sure it can
get out of the way and developers can be productive with their code rather than Googling for
configuration snippets. As an example, configuration database access with JPA is done
by adding the JPA _fraction_ and a database driver to the `pom.xml`, and then configuring
the database connection details in `src/main/resources/project-stages.yml`.

Examine `src/main/resources/META-INF/persistence.xml`{{open}} to see the JPA datasource configuration
for this project. Also note that the configurations uses `src/main/resources/META-INF/load.sql`{{open}} to import
initial data into the database.

Examine `src/main/resources/project-stages.yml`{{open}} to see the database connection details.
An in-memory H2 database is used in this scenario for local development and in the following
steps will be replaced with a PostgreSQL database with credentials coming from an OpenShift _secret_. Be patient! More on that later.

Build and package the Inventory service using Maven to make sure you code compiles:

`mvn clean package`{{execute}}

If builds successfully, continue to the next step to create a new service.
