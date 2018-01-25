Now that you've logged into OpenShift, let's deploy our new catalog microservice:

**Deploy the Database**

Our production catalog microservice will use an external database (PostgreSQL) to house inventory data.
First, deploy a new instance of PostgreSQL by executing:

`oc new-app -e POSTGRESQL_USER=catalog \
             -e POSTGRESQL_PASSWORD=mysecretpassword \
             -e POSTGRESQL_DATABASE=catalog \
             openshift/postgresql:latest \
             --name=catalog-database`{{execute}}

> **NOTE:** If you change the username and password you also need to update `src/main/fabric8/credential-secret.yml`{{open}} which contains
the credentials used when deploying to OpenShift.

This will deploy the database to our new project. Wait for it to complete:

`oc rollout status -w dc/catalog-database`{{execute}}

**Update configuration**
Create the file by clicking: `src/main/resources/application-openshift.properties`{{open}}

Copy the following content to the file:
<pre class="file" data-filename="src/main/resources/application-openshift.properties" data-target="replace">
server.port=8080
spring.datasource.url=jdbc:postgresql://${project.artifactId}-database:5432/catalog
spring.datasource.username=catalog
spring.datasource.password=mysecretpassword
spring.datasource.driver-class-name=org.postgresql.Driver

inventory.ribbon.listOfServers=inventory.inventory.svc.cluster.local:8080
</pre>

>**NOTE:** The `application-openshift.properties` does not have all values of `application-default.properties`, that is because on the values that need to change has to be specified here. Spring will fall back to `application-default.properties` for the other values.


**Build and Deploy**

Build and deploy the project using the following command, which will use the maven plugin to deploy:

`mvn package fabric8:deploy -Popenshift -DskipTests`{{execute}}

The build and deploy may take a minute or two. Wait for it to complete. You should see a **BUILD SUCCESS** at the
end of the build output.

After the maven build finishes it will take less than a minute for the application to become available.
To verify that everything is started, run the following command and wait for it complete successfully:

`oc rollout status -w dc/catalog`{{execute}}

>**NOTE:** If you recall in the WildFly Swarm lab Fabric8 detected the `health` _fraction_ and generated health check definitions for us, the same is true for Spring Boot if you have the `spring-boot-starter-actuator` dependency in our project.

**3. Access the application running on OpenShift**

This sample project includes a simple UI that allows you to access the Inventory API. This is the same
UI that you previously accessed outside of OpenShift which shows the CoolStore inventory. Click on the
[route URL](http://catalog-catalog.[[HOST_SUBDOMAIN]]-80-[[KATACODA_HOST]].environments.katacoda.com)
to access the sample UI.

> You can also access the application through the link on the OpenShift Web Console Overview page.

![Overview link](/redhat-middleware-workshops/assets/mono-to-micro-part-2/routelink.png)

The UI will refresh the catalog table every 2 seconds, as before.

>**NOTE:** Since we previously have a inventory service running you should now see the actual quantity value and not the fallback value of -1 

## Congratulations!

You have deployed the Catalog service as a microservice which in turn calls into the Inventory service to retrieve inventory data.
However, our monolih UI is still using its own built-in services. Wouldn't it be nice if we could re-wire the monolith to use the
new services, **without changing any code**? That's next!
