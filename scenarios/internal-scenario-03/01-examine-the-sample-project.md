The sample project shows the components of a basic WildFly Swarm project laid out in different
subdirectories according to Maven best practices.

**1. Examine the Maven project structure.**

> Click on the `tree` command below to automatically copy it into the terminal and execute it

``tree``{{execute}}

This is a minimal Java EE project with support for JAX-RS for building
RESTful services and JPA for connecting
to a database. [JAX-RS](https://docs.oracle.com/javaee/7/tutorial/jaxrs.htm)
is one of Java EE standards that uses Java annotations
to simplify the development of RESTful web services. [Java Persistence API (JPA)](https://docs.oracle.com/javaee/7/tutorial/partpersist.htm) is
another Java EE standard that provides Java developers with an
object/relational mapping facility for managing relational data in Java applications.

This project currently contains no code other than the main class for exposing a single
RESTful application defined in `src/main/java/com/redhat/coolstore/rest/RestApplication.java`{{open}}.

Run the Maven build to make sure the skeleton project builds successfully. You
should get a **BUILD SUCCESS** message in the logs, otherwise the build has failed.

> Make sure to run the **package** Maven goal and not **install**. The latter would
> download a lot more dependencies and do things you don't need yet!

`mvn clean package`{{execute}}

You should see a **BUILD SUCCESS** in the logs.

Once built, the resulting *jar* is located in the **target** directory:

`ls target/*.jar`{{execute}}

The listed jar archive, **inventory-1.0.0-SNAPSHOT-swarm.jar** , is an uber-jar with
all the dependencies required packaged in the *jar* to enable running the
application with **java -jar**. WildFly Swarm also creates a *war* packaging as a standard Java EE web app
that could be deployed to any Java EE app server (for example, JBoss EAP, or its upstream WildFly project).

Now let's write some code and create a domain model, service interface and a RESTful endpoint to access inventory:

![Inventory RESTful Service](/redhat-middleware-workshops/assets/mono-to-micro-part-1/wfswarm-inventory-arch.png)

