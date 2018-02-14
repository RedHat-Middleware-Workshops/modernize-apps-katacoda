Using the WildFly Swarm maven plugin (predefined in `pom.xml`{{open}}), you can conveniently run the application locally and test the endpoint.

`mvn wildfly-swarm:run`{{execute}}

> As an uber-jar, it could also be run with `java -jar target/inventory-1.0-SNAPSHOT-swarm.jar` but you don't need to do this now

Once the application is done initializing you should see:

```console
INFO  [org.wildfly.swarm] (main) WFSWARM99999: WildFly Swarm is Ready
```

Running locally using `wildfly-swarm:run` will use an in-memory database with default credentials. In a production application you
will use an external source for credentials using an OpenShift _secret_ in later steps, but for now this will work for development and
testing.

**3. Test the application**

To test the running application, click on the **Local Web Browser** tab in the console frame of this browser window. This will open another tab or window of your browser pointing to port 8080 on your client.

![Local Web Browser Tab](/redhat-middleware-workshops/assets/mono-to-micro-part-1/web-browser-tab.png)

> or use [this](https://[[HOST_SUBDOMAIN]]-8080-[[KATACODA_HOST]].environments.katacoda.com/) link.

You should now see a html page that looks like this

![App](/redhat-middleware-workshops/assets/mono-to-micro-part-1/app.png)

This is a simple webpage that will access the inventory *every 2 seconds* and refresh the table of product inventories.

You can also click the **Fetch Inventory** button to force it to refresh at any time.

To see the raw JSON output using `curl`, you can open an new terminal window by clicking on the plus (+)
icon on the terminal toolbar and then  choose **Open New Terminal**. You can also click on the following
command to automatically open a new terminal and run the test:

`curl http://localhost:8080/services/inventory/329299 ; echo`{{execute T2}}

You would see a JSON response like this:

```
{"itemId":"329299","location":"Raleigh","quantity":736,"link":"http://maps.google.com/?q=Raleigh"}
```

The REST API returned a JSON object representing the inventory count for this product. Congratulations!

**4. Stop the application**

Before moving on, click in the first terminal window where WildFly Swarm is running
and then press `CTRL-C` to stop the running application! (or click this command to issue
a `CTRL-C` for you: `clear`{{execute T1 interrupt}})

You should see something like:

```console
WFLYSRV0028: Stopped deployment inventory-1.0.0-SNAPSHOT.war (runtime-name: inventory-1.0.0-SNAPSHOT.war) in 70ms
```

This indicates the application is stopped.

## Congratulations

You have now successfully created your first microservice using WildFly Swarm and implemented a basic RESTful
API on top of the Inventory database. Most of the code is the same as was found in the monolith, demonstrating how
easy it is to migrate existing monolithic Java EE applications to microservices using WildFly Swarm.

In next steps of this scenario we will deploy our application to OpenShift Container Platform and then start
adding additional features to take care of various aspects of cloud native microservice development.
