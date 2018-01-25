For your convenience, this scenario has been created with a base project using the Java programming language and the Apache Maven build tool.

Initially, the project is almost empty and doesn't do anything. Start by reviewing the content by executing a
``tree``{{execute}} in your terminal.

The output should look something like this

```sh
.
├── pom.xml
├── README.md
└── src
    ├── main
    │   ├── fabric8
    │   │   ├── catalog-deployment.yml
    │   │   ├── catalog-route.yml
    │   │   └── credential-secret.yml
    │   ├── java
    │   │   └── com
    │   │       └── redhat
    │   │           └── coolstore
    │   │               ├── client
    │   │               ├── model
    │   │               │   ├── Inventory.java
    │   │               │   └── Product.java
    │   │               ├── RestApplication.java
    │   │               └── service
    │   └── resources
    │       ├── application-default.properties
    │       ├── schema.sql
    │       └── static
    │           └── index.html
    └── test
        └── java
            └── com
                └── redhat
                    └── coolstore
                        └── service
```


As you can see, there are some files that we have prepared for you in the project. Under `src/main/resources/static/index.html`{{open}}
we have for example prepared a simple html-based UI file for you. Except for the `fabric8/` folder and `index.html`, this
matches very well what you would get if you generated an empty project from the [Spring Initializr](https://start.spring.io) web
page. For the moment you can ignore the content of the `fabric8/` folder (we will discuss this later).

One this that differs slightly is the `pom.xml`. Please open the and examine it a bit closer (but do not change anything
at this time)

``pom.xml``{{open}}

As you review the content, you will notice that there are a lot of **TODO** comments. **Do not remove them!** These comments
are used as a marker and without them, you will not be able to finish this scenario.

Notice that we are not using the default BOM (Bill of material) that Spring Boot projects typically use. Instead, we are using
a BOM provided by Red Hat as part of the [Snowdrop](http://snowdrop.me/) project.

```xml
<dependencyManagement>
<dependencies>
  <dependency>
    <groupId>me.snowdrop</groupId>
    <artifactId>spring-boot-bom</artifactId>
    <version>${spring-boot.bom.version}</version>
    <type>pom</type>
    <scope>import</scope>
  </dependency>
</dependencies>
</dependencyManagement>
```

We use this bill of material to make sure that we are using the version of for example Apache Tomcat that Red Hat supports. 

**Adding web (Apache Tomcat) to the application**

Since our applications (like most) will be a web application, we need to use a servlet container like Apache Tomcat or
Undertow. Since Red Hat offers support for Apache Tomcat (e.g., security patches, bug fixes, etc.), we will use it.

>**NOTE:** Undertow is another an open source project that is maintained by Red Hat and therefore Red Hat plans to
add support for Undertow shortly.

To add Apache Tomcat to our project all we have to do is to add the following lines in ``pom.xml``{{open}}. Click **Copy to Editor**
to automatically add these lines:

<pre class="file" data-filename="pom.xml" data-target="insert" data-marker="<!-- TODO: Add web (tomcat) dependency here -->">
    &lt;dependency&gt;
      &lt;groupId&gt;org.springframework.boot&lt;/groupId&gt;
      &lt;artifactId&gt;spring-boot-starter-web&lt;/artifactId&gt;
    &lt;/dependency&gt;
</pre>

We will also make use of Java Persistance API (JPA) so we need to add the following to `pom.xml`

<pre class="file" data-filename="pom.xml" data-target="insert" data-marker="<!-- TODO: Add data jpa dependency here -->">
    &lt;dependency&gt;
      &lt;groupId&gt;org.springframework.boot&lt;/groupId&gt;
      &lt;artifactId&gt;spring-boot-starter-data-jpa&lt;/artifactId&gt;
    &lt;/dependency&gt;
</pre>

We will go ahead and add a bunch of other dependencies while we have the pom.xml open. These will be explained later.

<pre class="file" data-filename="pom.xml" data-target="insert" data-marker="<!-- TODO: Add actuator, feign and hystrix dependency here -->">
    &lt;dependency&gt;
      &lt;groupId&gt;org.springframework.boot&lt;/groupId&gt;
      &lt;artifactId&gt;spring-boot-starter-actuator&lt;/artifactId&gt;
    &lt;/dependency&gt;

    &lt;dependency&gt;
      &lt;groupId&gt;org.springframework.cloud&lt;/groupId&gt;
      &lt;artifactId&gt;spring-cloud-starter-feign&lt;/artifactId&gt;
    &lt;/dependency&gt;

    &lt;dependency&gt;
      &lt;groupId&gt;org.springframework.cloud&lt;/groupId&gt;
      &lt;artifactId&gt;spring-cloud-starter-hystrix&lt;/artifactId&gt;
    &lt;/dependency&gt;
</pre>

**Test the application locally**

As we develop the application, we might want to test and verify our change at different stages. We can do that
locally, by using the `spring-boot` maven plugin.

Run the application by executing the below command:

``mvn spring-boot:run``{{execute}}

>**NOTE:** The Katacoda terminal window is like your local terminal. Everything that you run here you should
be able to execute on your local computer as long as you have a `Java SDK 1.8` and `Maven`. In later steps, we
will also use the `oc` command line tool.

Wait for it to complete startup and report `Started RestApplication in ***** seconds (JVM running for ******)`

**3. Verify the application**

To begin with, click on the **Local Web Browser** tab in the console frame of this browser window, which will open another tab or window of your browser pointing to port 8081 on your client.

![Local Web Browser Tab](/redhat-middleware-workshops/assets/mono-to-micro-part-2/web-browser-tab.png)

or use [this](https://[[HOST_SUBDOMAIN]]-8081-[[KATACODA_HOST]].environments.katacoda.com/) link.

You should now see an HTML page that looks like this:

![Local Web Browser Tab](/redhat-middleware-workshops/assets/mono-to-micro-part-2/web-page.png)

> **NOTE:** The service calls to get products from the catalog doesn't work yet. Be patient! We will work on it in the next steps.

**4. Stop the application**

Before moving on, click here: `clear`{{execute interrupt}} to stop the running application.

## Congratulations

You have now successfully executed the first step in this scenario. 

Now you've seen how to get started with Spring Boot development on Red Hat OpenShift Application Runtimes

In next step of this scenario, we will add the logic to be able to read a list of fruits from the database.

