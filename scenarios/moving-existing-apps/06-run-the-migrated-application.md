Now that we migrated the application you are probably eager to test it. To test it we locally we first need to install JBoss EAP.

Run the following command in the terminal window.

``unzip -d $HOME $HOME/jboss-eap-7.1.0.zip``{{execute T1}}

We should also set the `JBOSS_HOME` environment variable like this:

``export JBOSS_HOME=$HOME/jboss-eap-7.1``{{execute T1}}

Done! That is how easy it is to install JBoss EAP. 

Open the `pom.xml`{{open}} file.

## The maven-wildfly-plugin
JBoss EAP comes with a nice maven-plugin tool that can stop, start, deploy, and configure JBoss EAP directly from Apache Maven. Let's add that the pom.xml file.

At the `TODO: Add wildfly plugin here` we are going to add a the following configuration

<pre class="file" data-filename="pom.xml" data-target="insert" data-marker="<!-- TODO: Add wildfly plugin here -->">
&lt;plugin&gt;
    &lt;groupId&gt;org.wildfly.plugins&lt;/groupId&gt;
    &lt;artifactId&gt;wildfly-maven-plugin&lt;/artifactId&gt;
    &lt;version&gt;1.2.1.Final&lt;/version&gt;
    &lt;!-- TODO: Add configuration here --&gt;
&lt;/plugin&gt;
</pre>

Next we are going to add some configuration. First we need to point to our JBoss EAP installation using the `jboss-home` configuration. After that we will also have to tell JBoss EAP to use the profile configured for full Java EE, since it defaults to use the Java EE Web Profile. This is done by adding a `server-config` and set it to value `standalone-full.xml`

<pre class="file" data-filename="pom.xml" data-target="insert" data-marker="<!-- TODO: Add configuration here -->">
&lt;configuration&gt;
    &lt;jboss-home&gt;${env.JBOSS_HOME}&lt;/jboss-home&gt;
    &lt;server-config&gt;standalone-full.xml&lt;/server-config&gt;
    &lt;resources&gt;
&lt;!-- TODO: Add Datasource definition here --&gt;
&lt;!-- TODO: Add JMS Topic definition here --&gt;
    &lt;/resources&gt;
    &lt;server-args&gt;
        &lt;server-arg&gt;-Djboss.https.port=8888&lt;/server-arg&gt;
        &lt;server-arg&gt;-Djboss.bind.address=0.0.0.0&lt;/server-arg&gt;
    &lt;/server-args&gt;
    &lt;javaOpts&gt;-Djava.net.preferIPv4Stack=true&lt;/javaOpts&gt;
&lt;/configuration&gt;
</pre>

Since our application is using a Database we also configuration that by adding the following at the ```<-- TODO: Add Datasource definition here -->``` comment

<pre class="file" data-filename="pom.xml" data-target="insert" data-marker="<!-- TODO: Add Datasource definition here -->">
&lt;resource&gt;
    &lt;addIfAbsent&gt;true&lt;/addIfAbsent&gt;
    &lt;address&gt;subsystem=datasources,data-source=CoolstoreDS&lt;/address&gt;
    &lt;properties&gt;
        &lt;jndi-name&gt;java:jboss/datasources/CoolstoreDS&lt;/jndi-name&gt;
        &lt;enabled&gt;true&lt;/enabled&gt;
        &lt;connection-url&gt;jdbc:h2:mem:test;DB_CLOSE_DELAY=-1&lt;/connection-url&gt;
        &lt;driver-class&gt;org.h2.Driver&lt;/driver-class&gt;
        &lt;driver-name&gt;h2&lt;/driver-name&gt;
        &lt;user-name&gt;sa&lt;/user-name&gt;
        &lt;password&gt;sa&lt;/password&gt;
    &lt;/properties&gt;
&lt;/resource&gt;
</pre>

Since our application is using a JMS Topic we are also need to add the configuration for that by adding the following at the ```<-- TODO: Add JMS Topic here -->``` comment

<pre class="file" data-filename="pom.xml" data-target="insert" data-marker="<!-- TODO: Add JMS Topic definition here -->">
&lt;resource&gt;
    &lt;address&gt;subsystem=messaging-activemq,server=default,jms-topic=orders&lt;/address&gt;
    &lt;properties&gt;
        &lt;entries&gt;!!["topic/orders"]&lt;/entries&gt;
    &lt;/properties&gt;
&lt;/resource&gt;
</pre>

We are now ready to build and test the project

## Configuring the JBoss EAP 

Our application is at this stage pretty standards based, but it needs two things. One is the  we need to add the JMS Topic since our application depends on it. 

``mvn wildfly:start wildfly:add-resource wildfly:shutdown``{{execute T1}}

Wait for a `BUILD SUCCESS` message. If it fails, check that you made all the correct changes and try again!

> NOTE: The reason we are using `wildfly:start` and `wildfly:shutdown` is because the `add-resource` command requires a running server. After we have added these resource we don't have to run this command again.

## Deploying the application

We are now ready to deploy the application

``export JBOSS_HOME=$HOME/jboss-eap-7.1 ; mvn wildfly:run``{{execute T1}}

Wait for the server to startup. You should see `Deployed "ROOT.war" (runtime-name: "ROOT.war")`
## Test the application

Access the application by clicking [here](https://[[HOST_SUBDOMAIN]]-8080-[[KATACODA_HOST]].environments.katacoda.com/) and shop around for some cool stuff.

![CoolStore Monolith](/redhat-middleware-workshops/assets/moving-existing-apps/coolstore-web.png)

You may see WARNINGs in the console output. We will fix these soon!

## Shutdown the application

Before moving on, click here to stop the process: `clear`{{execute interrupt}} (or click in the **Terminal** window and type CTRL-C).



