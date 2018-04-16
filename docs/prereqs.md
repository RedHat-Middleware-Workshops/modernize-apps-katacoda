# Intro

As modern application requirements become more complex, it’s apparent that one runtime, one
framework, or one architectural style is no longer a feasible strategy. Organizations must figure out how
to manage the complexity of distributed app development with diverse technologies, a lack of skilled
resources, and siloed processes.

In this hands-on workshop you’ll learn about:

* Migrating an existing legacy Java™ EE app to [Red Hat JBoss
Enterprise Application Platform](https://developers.redhat.com/products/eap/overview/) on [OpenShift](https://developers.redhat.com/products/openshift/overview/).
* Using modern frameworks like [Spring Boot](https://projects.spring.io/spring-boot/), [Wildfly Swarm](http://wildfly-swarm.io),
[Eclipse Vert.x](http://vertx.io), and [Node.js](https://nodejs.org) to implement microservices and
replace monolithic functionality.
* Developing and deploying using [Red Hat OpenShift Container
Platform](https://developers.redhat.com/products/openshift/overview/), [Red Hat OpenShift Application Runtimes](https://developers.redhat.com/products/rhoar/overview/), and
DevOps processes.
* The benefits and challenges with microservices, including use
cases for reactive microservices.
* Preventing and detecting issues in a distributed system.
* API gateways and microservices.

# Prerequisites

You can complete this workshop using either a Linux-based system such as RHEL or CentOS, or Windows 7
or later. Windows users should be aware of the [Prequisites and notes for Windows Users](https://developers.redhat.com/products/cdk/hello-world/) to
understand how to execute commands and refer to environment variables.

To complete this exercise using your own environment, you'll need to install the following software:

* [Red Hat Container Development Kit](https://developers.redhat.com/products/cdk/download/) - this includes OpenShift and the `oc` command line utility. Follow
the instructions for installing it and be sure you have access to the `oc` command and can login
(e.g. `oc login -u developer -p developer`). You can also use other versions of OpenShift version
3.7 or later, including [OpenShift Origin](https://www.openshift.org/).

> NOTE: After installing CDK, you must run additional setup outlined in the **Additional CDK Setup** section.

* [JBoss EAP 7.1.0 GA](https://developers.redhat.com/download-manager/file/jboss-eap-7.1.0.zip) - save the `.zip` file to your ${HOME} directory (it will be used in the first scenario)
* [OpenJDK 1.8 or later](http://openjdk.java.net/install/) with its `bin` directory on your `$PATH`
    * Run `java -version` and it should be `1.8.x` or later
* [Maven 3.3.9](http://maven.apache.org/download.cgi) or later
    * Run `mvn --version` and it should be `3.3.9` or later
* [Git 2.7.2](https://git-scm.com/downloads) or later
    * Run `git --version` and it should be `2.7.2` or later
* Various common Linux developer utilities (`unzip`, `curl`, `tree`, etc)
* A text editor or IDE for editing code
* [Red Hat Application Migration Toolkit 4.x](https://developers.redhat.com/products/rhamt/download/). Download
and unzip into the `${HOME}/rhamt-cli-4.0.0.Beta4` directory (you can install it elsewhere, but you'll need
to specify the path when running the tool during the first lab).
* A copy of the source code for exercises at `${HOME}/projects` (see below)
   * You can open the project(s) in your favorite IDE for editing as needed.

## Source code for exercises

The source code required for the exercises in this guide is in a
_Git_ repository on `github.com`. To use this source code,
you must _clone_ the repository into your `$HOME/projects` directory.

For example, the following command will clone the source code into
the appropriate directory for use with the guide:

```bash
git clone https://github.com/RedHat-Middleware-Workshops/modernize-apps-labs $HOME/projects
```

There is also a _solution_ branch in this repository, which refers to
the source code of the solution for each exercise. To access the solution,
you can use `git checkout solution`. Be sure to switch back to the `master`
branch when done viewing the solution using `git checkout master`.

## References to `/root`, `~` and `$HOME`

In various places throughout the exercises, commands are run using paths that
refer to `/root` and `~` and `$HOME` - this directory is the user's home directory and will be different,
depending on your OS and referred to as `%USER_HOME%` on Windows. You'll need to take care to replace the paths
appropriately if you've installed the tools and source code in somewhere other than `${HOME}` and
be sure to replace `$HOME` or `~` with `%USER_HOME%` as needed on Windows.

## Additional CDK Setup

This lab makes use of OpenShift features and Linux container images available on the Red Hat Container
Catalog and Docker Hub. To install and configure CDK to use them, run the following command:

```bash
oc login -u system:admin # login as cluster admin

# Add admin privileges for admin and developer
oc adm policy add-role-to-user system:image-puller system:anonymous
oc adm policy add-cluster-role-to-user cluster-admin admin
oc adm policy add-cluster-role-to-user sudoer developer

# Import jenkins images and re-tag for 3.7
oc import-image jenkins:v3.7 --from='registry.access.redhat.com/openshift3/jenkins-2-rhel7:v3.7' --confirm -n openshift
oc export template jenkins-persistent -n openshift -o json | sed 's/jenkins:latest/jenkins:v3.7/g' | oc replace -f - -n openshift
oc export template jenkins-ephemeral -n openshift -o json | sed 's/jenkins:latest/jenkins:v3.7/g' | oc replace -f - -n openshift

# import Monolith templates and JBoss Imagestreams
oc create -n openshift -f https://raw.githubusercontent.com/openshift/openshift-ansible/release-3.9/roles/openshift_examples/files/examples/v3.9/xpaas-streams/jboss-image-streams.json
oc create -n openshift -f https://raw.githubusercontent.com/RedHat-Middleware-Workshops/modernize-apps-labs/master/monolith/src/main/openshift/template-binary.json
oc create -n openshift -f https://raw.githubusercontent.com/RedHat-Middleware-Workshops/modernize-apps-labs/master/monolith/src/main/openshift/template-prod.json

# Disable namespace ownership for router
oc env dc/router ROUTER_DISABLE_NAMESPACE_OWNERSHIP_CHECK=true -n default

echo "Importing images" 
for is in {"registry.access.redhat.com/jboss-eap-7/eap70-openshift","registry.access.redhat.com/rhscl/postgresql-94-rhel7","registry.access.redhat.com/redhat-openjdk-18/openjdk18-openshift"}
do 
  oc import-image $is --all --confirm --as=system:admin 
done
```


