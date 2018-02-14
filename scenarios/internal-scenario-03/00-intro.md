In the previous scenarios you learned how to take an existing monolithic Java EE application to the cloud
with JBoss EAP and OpenShift, and you got a glimpse into the power of OpenShift for existing applications.

You will now begin the process of modernizing the application by breaking the application into multiple
microservices using different technologies, with the eventual goal of re-architecting the entire application as a set of
distributed microservices. Later on we'll explore how you can better manage and monitor the application after
it is re-architected.

In this scenario you will learn more about [WildFly Swarm](https://wildfly-swarm.io), one of the runtimes
included in [Red Hat OpenShift Application Runtimes](https://developers.redhat.com/products/rhoar). WildFly
Swarm is a great place to start since our application is a Java EE application, and your skills as a Java EE
developer will naturally translate to the world of WildFly Swarm.

You will implement one component of the monolith as a WildFly Swarm microservice and modify it to address
microservice concerns, understand its structure, deploy it to OpenShift and exercise the interfaces between
WildFly Swarm apps, microservices, and OpenShift/Kubernetes.

## Goals of this scenario

The goal is to deploy this new microservice alongside the existing monolith, and then later on we'll tie them together.
But after this scenario, you should end up with something like:

![Logo](/redhat-middleware-workshops/assets/mono-to-micro-part-1/goal.png)

## What is WildFly Swarm? 

![Logo](/redhat-middleware-workshops/assets/mono-to-micro-part-1/swarm-logo.png)

Java EE applications are traditionally created as an **ear** or **war** archive including all 
dependencies and deployed in an application server. Multiple Java EE applications can and 
were typically deployed in the same application server. This model is well understood in 
the development teams and has been used over the past several years.

[WildFly Swarm](http://wildfly-swarm.io) offers an innovative approach to packaging and 
running Java EE applications by 
packaging them with just enough of the Java EE server runtime to be able to run them directly 
on the JVM using **java -jar** For more details on various approaches to packaging Java 
applications,
read [this blog post](https://developers.redhat.com/blog/2017/08/24/the-skinny-on-fat-thin-hollow-and-uber).

WildFly Swarm is based on WildFly and it's compatible with 
[Eclipse MicroProfile](https://microprofile.io), which is a community effort to standardized the subset of Java EE standards 
such as JAX-RS, CDI and JSON-P that are useful for building microservices applications.

Since WildFly Swarm is based on Java EE standards, it significantly simplifies refactoring 
existing Java EE application to microservices and allows much of existing code-base to be 
reused in the new services.




