As you have seen in previous steps, using the Spring Boot maven plugin (predefined in `pom.xml`{{open}}), you can conveniently run the application locally and test the endpoint.

Execute the following command to run the new service locally:

`mvn spring-boot:run`{{execute}}

>**INFO:** As an uber-jar, it could also be run with `java -jar target/catalog-1.0-SNAPSHOT-swarm.jar` but you don't need to do this now

Once the application is done initializing you should see:

```console
INFO  [           main] com.redhat.coolstore.RestApplication     : Started RestApplication ...
```

Running locally using `spring-boot:run` will use an in-memory database with default credentials. In a production application you
will use an external source for credentials using an OpenShift _secret_ in later steps, but for now this will work for development and
testing.

**3. Test the application**

To test the running application, click on the **Local Web Browser** tab in the console frame of this browser window. This will open another tab or window of your browser pointing to port 8081 on your client.

![Local Web Browser Tab](/redhat-middleware-workshops/assets/mono-to-micro-part-2/web-browser-tab.png)

> or use [this](https://[[HOST_SUBDOMAIN]]-8081-[[KATACODA_HOST]].environments.katacoda.com/) link.

You should now see a html page that looks like this

![App](/redhat-middleware-workshops/assets/mono-to-micro-part-2/app-new.png)

This is a simple webpage that will access the inventory *every 2 seconds* and refresh the table of product inventories.

You can also click the **Fetch Catalog** button to force it to refresh at any time.

To see the raw JSON output using `curl`, you can open an new terminal window by clicking on the plus (+)
icon on the terminal toolbar and then  choose **Open New Terminal**. You can also click on the following
command to automatically open a new terminal and run the test:

`curl http://localhost:8081/services/product/329299 ; echo`{{execute T2}}

You would see a JSON response like this:

```
{"itemId":"329299","name":"Red Fedora","desc":"Official Red Hat Fedora","price":34.99,"quantity":-1}%
```
>**NOTE:** Since we do not have an inventory service running locally the value for the quantity is -1, which matches the fallback value that we have configured. 

The REST API returned a JSON object representing the inventory count for this product. Congratulations!

**4. Stop the application**

Before moving on, click in the first terminal window where the app is running and then press CTRL-C to stop the running application! Or click `clear`{{execute T1 interrupt}} to do it for you.

## Congratulations

You have now successfully created your the Catalog service using Spring Boot and implemented basic REST
API on top of the product catalog database. You have also learned how to deal with service failures. 

In next steps of this scenario we will deploy our application to OpenShift Container Platform and then start
adding additional features to take care of various aspects of cloud native microservice development.
