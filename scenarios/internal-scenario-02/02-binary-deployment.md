Another way to deploy application is to use binary deployment. This means that we will build the application locally and then provide the artifact of the build to the S2I process and let if build the container for us.

This time we will use a template that helps us setup the necessary service account, database and JMS topic.

First, let's create a new project:

`oc new-project coolstore-bin`{{execute T1}}

And deploy the template:

`oc new-app coolstore-monolith-binary-build`{{execute T1}}

This will deploy both a PostgreSQL database and JBoss EAP, but it will not start a build for our application.

Then [open up the Monolith Overview page](https://[[HOST_SUBDOMAIN]]-8443-[[KATACODA_HOST]].environments.katacoda.com/console/project/coolstore-dev/)
and verify the monolith template items are created:

![OpenShift Console](/redhat-middleware-workshops/assets/moving-existing-apps/no-deployments.png)

You can see the components being deployed on the
Project Overview, but notice the **No deployments for Coolstore**. You have not yet deployed
the container image built in previous steps, but you'll do that next.


**4. Deploy application using Binary build**

In this development project we have selected to use a process called binary builds, which
means that instead of pointing to a public Git Repository and have the S2I (Source-to-Image) build process
download, build, and then create a container image for us we are going to build locally
and just upload the artifact (e.g. the `.war` file). The binary deployment will speed up
the build process significantly.

First, build the project once more using the `openshift` Maven profile, which will create a
suitable binary for use with OpenShift (this is not a container image yet, but just the `.war`
file). We will do this with the `oc` command line.

Build the project:

``mvn clean package -Popenshift``{{execute T1}}

Wait for the build to finish and the `BUILD SUCCESS` message!

And finally, start the build process that will take the `.war` file and combine it with JBoss
EAP and produce a Linux container image which will be automatically deployed into the project,
thanks to the *DeploymentConfig* object created from the template:

``oc start-build coolstore --from-file=deployments/ROOT.war``{{execute T1}}

Check the OpenShift web console and you'll see the application being built:

![OpenShift Console](/redhat-middleware-workshops/assets/moving-existing-apps/building.png)

Wait for the build and deploy to complete:

``oc rollout status -w dc/coolstore``{{execute T1}}

This command will be used often to wait for deployments to complete. Be sure it returns success when you use it!
You should eventually see `replication controller "coolstore-1" successfully rolled out`.

> If the above command reports `Error from server (ServerTimeout)` then simply re-run the command until it reports success!


When it's done you should see the application deployed successfully with blue circles for the
database and the monolith:

![OpenShift Console](/redhat-middleware-workshops/assets/moving-existing-apps/build-done.png)

Test the application by clicking on the [Route link](http://www-coolstore-dev.[[HOST_SUBDOMAIN]]-80-[[KATACODA_HOST]].environments.katacoda.com),
which will open the same monolith Coolstore in your browser, this time running on OpenShift:

![OpenShift Console](/redhat-middleware-workshops/assets/moving-existing-apps/route-link.png)

## Congratulations!

Now you have now deploy the same application/artifact that we built locally on OpenShift. That wasn't too hard right?

![CoolStore Monolith](/redhat-middleware-workshops/assets/moving-existing-apps/coolstore-web.png)

In the next step you'll explore more of the developer features of OpenShift in preparation for moving the
monolith to a microservices architecture later on. Let's go!








