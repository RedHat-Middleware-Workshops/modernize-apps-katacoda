

## Creating a test.

Before we create the database repository class to access the data it's good practice to create test cases for the different methods that we will use.

Click to open ``src/test/java/com/redhat/coolstore/service/ProductRepositoryTest.java``{{open}} to create the empty file and
then **Copy to Editor** to copy the below code into the file:

<pre class="file" data-filename="src/test/java/com/redhat/coolstore/service/ProductRepositoryTest.java" data-target="replace">
package com.redhat.coolstore.service;

import java.util.List;
import java.util.stream.Collectors;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import static org.assertj.core.api.Assertions.assertThat;

import com.redhat.coolstore.model.Product;


@RunWith(SpringRunner.class)
@SpringBootTest()
public class ProductRepositoryTest {

//TODO: Insert Catalog Component here

//TODO: Insert test_readOne here

//TODO: Insert test_readAll here

}

</pre>

Next, inject a handle to the future repository class which will provide access to the underlying data repository. It is
injected with Spring's `@Autowired` annotation which locates, instantiates, and injects runtime instances of classes automatically,
and manages their lifecycle (much like Java EE and it's CDI feature). Click to create this code:

<pre class="file" data-filename="src/test/java/com/redhat/coolstore/service/ProductRepositoryTest.java" data-target="insert" data-marker="//TODO: Insert Catalog Component here">
@Autowired
ProductRepository repository;
</pre>

The `ProductRepository` should provide a method called `findById(String id)` that returns a product and collect that from the database. We test this by querying for a product with id "444434" which should have name "Pebble Smart Watch". The pre-loaded data comes from the `src/main/resources/schema.sql` file.

Click to insert this code:

<pre class="file" data-filename="src/test/java/com/redhat/coolstore/service/ProductRepositoryTest.java" data-target="insert" data-marker="//TODO: Insert test_readOne here">
@Test
public void test_readOne() {
    Product product = repository.findById("444434");
    assertThat(product).isNotNull();
    assertThat(product.getName()).as("Verify product name").isEqualTo("Pebble Smart Watch");
    assertThat(product.getQuantity()).as("Quantity should be ZEOR").isEqualTo(0);
}
</pre>

The `ProductRepository` should also provide a methods called `readAll()` that returns a list of all products in the catalog. We test this by making sure that the list contains a "Red Fedora", "Forge Laptop Sticker" and "Oculus Rift".
Again, click to insert the code:

<pre class="file" data-filename="src/test/java/com/redhat/coolstore/service/ProductRepositoryTest.java" data-target="insert" data-marker="//TODO: Insert test_readAll here">
@Test
public void test_readAll() {
    List&lt;Product&gt; productList = repository.readAll();
    assertThat(productList).isNotNull();
    assertThat(productList).isNotEmpty();
    List&lt;String&gt; names = productList.stream().map(Product::getName).collect(Collectors.toList());
    assertThat(names).contains("Red Fedora","Forge Laptop Sticker","Oculus Rift");
}
</pre>

## Implement the database repository

We are now ready to implement the database repository.  

Create the ``src/main/java/com/redhat/coolstore/service/ProductRepository.java``{{open}} by clicking the open link.

Here is the base for the calls, click on the copy button to paste it into the editor:

<pre class=file data-filename="src/main/java/com/redhat/coolstore/service/ProductRepository.java" data-target="replace">
package com.redhat.coolstore.service;

import java.util.List;

import com.redhat.coolstore.model.Product;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

@Repository
public class ProductRepository {

//TODO: Autowire the jdbcTemplate here

//TODO: Add row mapper here

//TODO: Create a method for returning all products

//TODO: Create a method for returning one product

}

</pre>

> NOTE: That the class is annotated with `@Repository`. This is a feature of Spring that makes it possible to avoid a lot of boiler plate code and only write the implementation details for this data repository. It also makes it very easy to switch to another data storage, like a NoSQL database.

Spring Data provides a convenient way for us to access data without having to write a lot of boiler plate code. One way to do that is to use a `JdbcTemplate`. First we need to autowire that as a member to `ProductRepository`. Click to add it:

<pre class="file" data-filename="src/main/java/com/redhat/coolstore/service/ProductRepository.java" data-target="insert" data-marker="//TODO: Autowire the jdbcTemplate here">
@Autowired
private JdbcTemplate jdbcTemplate;
</pre>

The `JdbcTemplate` require that we provide a `RowMapper`so that it can map between rows in the query to Java Objects. We are going to define the `RowMapper` like this (click to add it):

<pre class="file" data-filename="src/main/java/com/redhat/coolstore/service/ProductRepository.java" data-target="insert" data-marker="//TODO: Add row mapper here">
private RowMapper&lt;Product&gt; rowMapper = (rs, rowNum) -> new Product(
        rs.getString("itemId"),
        rs.getString("name"),
        rs.getString("description"),
        rs.getDouble("price"));
</pre>

Now we are ready to create the methods that are used in the test. Let's start with the `readAll()`. It should return a `List<Product>` and then we can write the query as `SELECT * FROM catalog` and use the rowMapper to map that into `Product` objects. Our method should look like this (click to add it):

<pre class="file" data-filename="src/main/java/com/redhat/coolstore/service/ProductRepository.java" data-target="insert" data-marker="//TODO: Create a method for returning all products">
public List&lt;Product&gt; readAll() {
    return jdbcTemplate.query("SELECT * FROM catalog", rowMapper);
}
</pre>

The `ProductRepositoryTest` also used another method called `findById(String id)` that should return a Product. The implementation of that method using the `JdbcTemplate` and `RowMapper` looks like this (click to add it):

<pre class="file" data-filename="src/main/java/com/redhat/coolstore/service/ProductRepository.java" data-target="insert" data-marker="//TODO: Create a method for returning one product">
public Product findById(String id) {
    return jdbcTemplate.queryForObject("SELECT * FROM catalog WHERE itemId = '" + id + "'", rowMapper);
}
</pre>

The `ProductRepository` should now have all the components, but we still need to tell spring how to connect to the database. For local development we will use the H2 in-memory database. When deploying this to OpenShift we are instead going to use the PostgreSQL database, which matches what we are using in production.

The Spring Framework has a lot of sane defaults that can always seem magical sometimes, but basically all we have todo to setup the database driver is to provide some configuration values. Open ``src/main/resources/application-default.properties``{{open}} and add the following properties where the comment says "#TODO: Add database properties"
Click to add it:

<pre class="file" data-filename="src/main/resources/application-default.properties" data-target="insert" data-marker="#TODO: Add database properties"> 
spring.datasource.url=jdbc:h2:mem:catalog;DB_CLOSE_ON_EXIT=FALSE
spring.datasource.username=sa
spring.datasource.password=sa
spring.datasource.driver-class-name=org.h2.Driver
</pre>

The Spring Data framework will automatically see if there is a schema.sql in the class path and run that when initializing.

Now we are ready to run the test to verify that everything works. Because we created the `ProductRepositoryTest.java` all we have todo is to run: ``mvn verify``{{execute interrupt}}

The test should be successful and you should see **BUILD SUCCESS**, which means that we can read that our repository class works as as expected.

## Congratulations

You have now successfully executed the second step in this scenario. 

Now you've seen how to use Spring Data to collect data from the database and how to use a local H2 database for development and testing.

In next step of this scenario, we will add the logic to expose the database content from REST endpoints using JSON format.
