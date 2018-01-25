In this step we will analyze an existing application built for use with
Oracle® WebLogic Server (WLS). This application is a Java EE application
using a number of different technologies, including standard Java EE APIs
as well as proprietary Weblogic APIs and best practices.

The Red Hat Application Migration Toolkit can be installed and used in a few different ways:

* **Web Console** - The web console for Red Hat Application Migration Toolkit is a web-based system that allows a team of users to assess and prioritize migration and modernization efforts for a large number of applications. It allows you to group applications into projects for analysis and provides numerous reports that highlight the results.
* **Command Line Interface** - The CLI is a command-line tool that allows users to assess and prioritize migration and modernization efforts for applications. It provides numerous reports that highlight the analysis results.
* **Eclipse Plugin** - The Eclipse plugin for Red Hat Application Migration Toolkit provides assistance directly in Eclipse and Red Hat JBoss Developer Studio for developers making changes for a migration or modernization effort. It analyzes your projects using RHAMT, marks migration issues in the source code, provides guidance to fix the issues, and offers automatic code replacement when possible.

For this scenario, we will use the CLI as you are the only one that will run RHAMT in this system. For multi-user use, the Web Console would be a good option.

**1. Verify Red Hat Application Migration Toolkit CLI**

The RHAMT CLI is has been installed for you. To verify that the tool was properly installed, run:

`${HOME}/rhamt-cli-4.0.0.Beta4/bin/rhamt-cli --version`{{execute T1}}

You should see:

```
Using RHAMT at /root/rhamt-cli-4.0.0.Beta4
> Red Hat Application Migration Toolkit (RHAMT) CLI, version 4.0.0.Beta4.
```

**2. Inspect the project source code**

The sample project we will migrate is a monolithic Java EE application that implements
an online shopping store called _Coolstore_ containing retail items that you can add to a shopping
cart and purchase. The source code is laid out in different
subdirectories according to Maven best practices.

> Click on the `tree` command below to automatically copy it into the terminal and execute it

``tree -L 3``{{execute}}

You should see:

```console
.
├── hello.txt
├── pom.xml
├── README.md
└── src
    └── main
        ├── java
        ├── openshift
        ├── resources
        └── webapp
```

This is a minimal Java EE project which uses [JAX-RS](https://docs.oracle.com/javaee/7/tutorial/jaxrs.htm) for building
RESTful services and the [Java Persistence API (JPA)](https://docs.oracle.com/javaee/7/tutorial/partpersist.htm) for connecting
to a database and an [AngularJS](https://angularjs.org) frontend.

When you later deploy the application, it will look like:

![CoolStore Monolith](/redhat-middleware-workshops/assets/moving-existing-apps/coolstore-web.png)

**3. Run the RHAMT CLI against the project**

The RHAMT CLI has a number of options to control how it runs. Click on the below command
to execute the RHAMT CLI and analyze the existing project:

```
~/rhamt-cli-4.0.0.Beta4/bin/rhamt-cli \
  --sourceMode \
  --input ~/projects/monolith \
  --output ~/rhamt-reports/monolith \
  --overwrite \
  --source weblogic \
  --target eap:7 \
  --packages com.redhat weblogic
```{{execute T1}}

> Note the use of the ``--source`` and ``--target`` options. This allows you to target specific migration paths supported by RHMAT. Other
migration paths include **IBM® WebSphere® Application Server** and **JBoss EAP** 5/6/7.

**Wait for it to complete before continuing!**. You should see `Report created: /root/rhamt-reports/monolith/index.html`.

**3. View the results**

Next, [click to view the report](https://[[HOST_SUBDOMAIN]]-9000-[[KATACODA_HOST]].environments.katacoda.com/monolith)

You should see the landing page for the report:

![Landing Page](/redhat-middleware-workshops/assets/moving-existing-apps/landingpage.png)

The main landing page of the report lists the applications that were processed. Each row contains a high-level overview of the story points, number of incidents, and technologies encountered in that application.

Click on the `monolith` link to access details for the project:

![Project Overview](/redhat-middleware-workshops/assets/moving-existing-apps/project-overview.png)

## Understanding the report

The Dashboard gives an overview of the entire application migration effort. It summarizes:

* The incidents and story points by category
* The incidents and story points by level of effort of the suggested changes
* The incidents by package

> Story points are an abstract metric commonly used in Agile software development to estimate the relative level of effort needed to implement a feature or change.
Red Hat Application Migration Toolkit uses story points to express the level of effort needed to migrate particular application constructs, and the application as a whole.
The level of effort will vary greatly depending on the size and complexity of the application(s) to migrate.

There are several other sub-pages accessible by the menu near the top. Cick on each one and observe the results for each of these pages:

* **All Applications** Provides a list of all applications scanned.
* **Dashboard** Provides an overview for a specific application.
* **Issues** Provides a concise summary of all issues that require attention.
* **Application Details** provides a detailed overview of all resources found within the application that may need attention during the migration.
* **Unparsable** shows all files that RHAMT could not parse in the expected format. For instance, a file with a .xml or .wsdl suffix is assumed to be an XML file. If the XML parser fails, the issue is reported here and also where the individual file is listed.
* **Dependencies** displays all Java-packaged dependencies found within the application.
* **Remote Services** Displays all remote services references that were found within the application.
* **EJBs** vontains a list of EJBs found within the application.
* **JBPM** vontains all of the JBPM-related resources that were discovered during analysis.
* **JPA** vontains details on all JPA-related resources that were found in the application.
* **About** Describes the current version of RHAMT and provides helpful links for further assistance.

> Some of the above sections may not appear depending on what was detected in the project.

Now that you have the RHAMT report available, let's get to work migrating the app!

