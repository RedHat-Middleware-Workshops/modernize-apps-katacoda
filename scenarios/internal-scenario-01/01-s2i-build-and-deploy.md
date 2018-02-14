First, let's create a project to host our application.

``oc new-project demo``{{execute}}

Now, let's deploy our application using the template and example application

``oc new-app eap71-basic-s2i``{{execute}}

Check the log file for the build to complete

``oc logs -f bc/eap-app``{{execute}}

Notice all the "Downloading ..."??? We will come back to that later

After the build completes wait for the application to deploy, by running

``oc rollout status -w dc eap-app``{{execute interrupt}}

We can now access the application, either from OpenShift console or directly [here](http://eap-app-demo.[[HOST_SUBDOMAIN]]-80-[[KATACODA_HOST]].environments.katacoda.com)











