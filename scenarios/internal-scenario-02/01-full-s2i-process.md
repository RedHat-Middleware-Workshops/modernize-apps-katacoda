Let's first look at local build and how long it takes. For this we have a more realistic, but still small retail application built using Java EE. This application is what developers today refer to as a monolith, which means that all components, like Product Catalog, Shopping Cart, Inventory, etc are deployed in a single application. This application also uses JMS, which stands for Java Messaging System and can be seen as a trusted way to deliver async messages (like orders) between internal components and/or external systems.

The component diagram looks like this: 

![CoolStore Monolith component diagram](/redhat-middleware-workshops/assets/internal/coolstore-mono-architecture.png)

We are going to use JBoss Enterprise Application Platform 7.1 to deploy this to OpenShift. This also means that we need to apply some configuration to JBoss EAP. For example we need to tell it where our database is hosted and also which JMS queues to create. However, the S2I build for JBoss EAP does support doing that via environment variables. There are also templates that will provide us with that capability. 

Let's first see what templates are installed in our OpenShift instance that uses EAP7.1.

``oc get templates -n openshift | grep eap71``{{execute T1}}

The `eap71-postgresql-s2i` sounds promising, lets investigate it.

``oc describe template eap71-postgresql-s2i -n openshift``{{execute T1}}

Wow, that is a lot of details. Let's see if we can list just the parameters

``oc process --parameters  eap71-postgresql-s2i -n openshift``{{execute T1}}

Also there are some references to secrets and service accounts in there so by checking the documentation we can see that there are a number of pre-requisites that we need to do

First, we need to create a new project

``oc new-project coolstore-s2i``{{execute T1}}

Then, we need to create a service account for eap7
``oc create serviceaccount eap7-service-account``{{excute T1}}

We also link the serviceaccount to the project
``oc policy add-role-to-user view system:serviceaccount:coolstore-s2i:eap7-service-account``{{exeute T1}}

Then we need to create a selfsigned certificate and store it in a keystore (requires more input)
``keytool -genkey -keyalg RSA -alias eapdemo-selfsigned -keystore keystore.jks -validity 360 -keysize 2048``{{execute T1}}

Now, we can generate a secret from that keystore
``oc secrets new eap7-app-secret keystore.jks``{{execute T1}}

And link it to our service account.
``oc secrets link eap7-service-account eap7-app-secret``{{execute T1}}

Puhh! 

Now we are ready to deploy our application. But for that we need to set a bounch of parameter. Some of these parameters are we need to specify to point the git hub repo, but the interesting parameters are:

* DB_JNDI,DB_DATABASE, DB_USERNAME and DB_PASSWORD - These are used to both configure a datasource in JBoss EAP as well as by the application to connect to the database and retrive the content.
* MQ_TOPIC - Will create create a JMS Topic in our JBoss EAP configuration and it's hardcoded in our application to go to topic/orders.

``oc process openshift//eap71-postgresql-s2i \
  -p APPLICATION_NAME=coolstore \
  -p SOURCE_REPOSITORY_URL="https://github.com/RedHat-Middleware-Workshops/modernize-apps-labs.git" \
  -p SOURCE_REPOSITORY_REF=solution \
  -p CONTEXT_DIR=monolith \
  -p DB_JNDI="java:jboss/datasources/CoolstoreDS" \
  -p DB_DATABASE=coolstore \
  -p DB_USERNAME=coolstore \
  -p DB_PASSWORD=coolstore123 \
  -p MQ_TOPICS=orders | oc create -f -``{{execute T1}}

>**NOTE:** Even if the templates sets up a secure router for us it will not work in the Katacoda environment since Katacoda are using a gateway that will terminate HTTPS.

Wait for the application to deploy.

``oc rollout status -w dc/coolstore``{{execute T1}}

If you like to see the project building you can use the OpenShift Console tab and login as developer/developer and go to the coolstore-s2i project.

When the rollout is done you can access the application using [this link](http://coolstore-coolstore-s2i.[[HOST_SUBDOMAIN]]-80-[[KATACODA_HOST]].environments.katacoda.com)

# Summary
That is awesome, without any changes to the code we could deploy our application to OpenShift using the existing JBoss EAP templates and S2I process. However, as you can also see moving an application to OpenShift using our "documented" process is kind of hard and requires a lot of a developer that might be new to the OpenShift Container Platform.

