First, we need to install JBoss Enterprise Application Platform. JBoss EAP is available to download for free (after registering for a developer account) at http://developer.redhat.com, but for your convenience, we have already provided a ZIP file located in the home directory.

Run the following command in the terminal window to install JBoss EAP.

``unzip -d $HOME $HOME/jboss-eap-7.1.0.zip``{{execute T1}}

We should also set the `JBOSS_HOME` environment variable like this:

``export JBOSS_HOME=$HOME/jboss-eap-7.1``{{execute T1}}

Done! That is how easy it is to install JBoss EAP. 


## The maven-wildfly-plugin
JBoss EAP comes with a convenient maven plugin that can stop, start, deploy, and configure JBoss EAP directly from Apache Maven. Since the pom.xml (the file that controls the build process for maven projects) is part of the source it's common practice for java developers to store the full configuration etc in the maven project. 

Open the `pom.xml`{{open}} file.

Review the maven plugin and the configuration in it. 

## Configuring the JBoss EAP 

Our application is at this stage pretty standards based, but it needs two things. One is the  we need to add the JMS Topic since our application depends on it and we also need to add a datasource. For the local development we will use a in-memory H2 database that doesn't require the developer to setup a local database.

``mvn wildfly:start``{{execute T1}}

Wait for a `BUILD SUCCESS` message. If it fails, check that you made all the correct changes and try again!

``mvn wildfly:add-resource``{{execute T1}}

This is very we apply the configuration to JBoss EAP 7.1.

You can review the changes done to the JBoss EAP by opening ``$HOME/jboss-eap-7.1/standalone/configuration/standalone-full.xml``{{open}}


## Deploying the application

We are now ready to deploy the application

``mvn package wildfly:deploy``{{execute T1}}

Wait for the application to deploy and you should see `Deployed "ROOT.war" (runtime-name: "ROOT.war")`

## Test the application

Access the application by clicking [here](https://[[HOST_SUBDOMAIN]]-8080-[[KATACODA_HOST]].environments.katacoda.com/) and shop around for some cool stuff.

![CoolStore Monolith](/redhat-middleware-workshops/assets/moving-existing-apps/coolstore-web.png)

You may see WARNINGs in the console output. We will fix these soon!

## Shutdown the application

Before moving on, click here to stop the process: `clear`{{execute interrupt}} (or click in the **Terminal** window and type CTRL-C).



