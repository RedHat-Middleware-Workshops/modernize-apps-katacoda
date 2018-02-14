First, let's create a project to host our application.

``oc new-project demo``{{execute}}

Now, let's deploy our application using the template and example application

``oc new-app eap71-basic-s2i``{{execute}}

This template brings up JBoss EAP with the [EAP Quickstarts](https://github.com/jboss-developer/jboss-eap-quickstarts) GitHub [kitchensink](https://github.com/jboss-developer/jboss-eap-quickstarts/tree/7.1/kitchensink) context. This application uses JAX-RS (the nice way to write REST endpoints) and JPA (the nice way to interact with databases) to make a very simple little "users" application with REST endpoints. In this example we are using a preconfigured in-memory database (H2).

If you had wanted to use your own GitHub (or BitBucket) repo. you could have passed those as paremeters into the template during the new-app command. 

You can log into the web console if you want to watch the logs and see the deployment. Some prefer the graphical interface for getting an overview of the application, even if they use the CLI to "spin things up".

For now we will show you the command line options.
Check the log file for the build to complete

``oc logs -f bc/eap-app``{{execute}}

It is important that you pay attention to how long this build takes compared to what you saw in the demo.

Notice all the "Downloading ..."??? We will come back to that later

After the build completes wait for the application to deploy, by running

``oc rollout status -w dc eap-app``{{execute interrupt}}

We can now access the application, either from OpenShift console or directly [here](http://eap-app-demo.[[HOST_SUBDOMAIN]]-80-[[KATACODA_HOST]].environments.katacoda.com)

Please go ahead and try to add some users to the application and click the endpoints. 

With that, you have now completed an S2I build of some Java source. Simple to load and run.











