There are several concepts in OpenShift useful for developers, and in this workshop
you should be familiar with them.

## Projects

[Projects](https://docs.openshift.com/container-platform/3.6/architecture/core_concepts/projects_and_users.html#projects)
are a top level concept to help you organize your deployments. An
OpenShift project allows a community of users (or a user) to organize and manage
their content in isolation from other communities. Each project has its own
resources, policies (who can or cannot perform actions), and constraints (quotas
and limits on resources, etc). Projects act as a wrapper around all the
application services and endpoints you (or your teams) are using for your work.

## Containers
The basic units of OpenShift applications are called containers (sometimes called Linux Containers).
[Linux container technologies](https://access.redhat.com/articles/1353593) are lightweight mechanisms for isolating running processes
so that they are limited to interacting with only their designated resources.

Though you do not directly interact with the Docker CLI or service when using OpenShift Container
Platform, understanding their capabilities and terminology is important for understanding their
role in OpenShift Container Platform and how your applications function inside of containers.

## Pods
OpenShift Container Platform leverages the Kubernetes concept of a pod, which is one or more
containers deployed together on one host, and the smallest compute unit that can be defined,
deployed, and managed.

Pods are the rough equivalent of a machine instance (physical or virtual) to a container.
Each pod is allocated its own internal IP address, therefore owning its entire port space,
and containers within pods can share their local storage and networking.


## Images
Containers in OpenShift are based on Docker-formatted container images.
An image is a binary that includes all of the requirements for running a single container,
as well as metadata describing its needs and capabilities.

You can think of it as a packaging technology. Containers only have access to resources
defined in the image unless you give the container additional access when creating it.
By deploying the same image in multiple containers across multiple hosts and load balancing
between them, OpenShift Container Platform can provide redundancy and horizontal scaling
for a service packaged into an image.

## Image Streams
An image stream and its associated tags provide an abstraction for referencing
Images from within OpenShift. The image stream and its tags allow you
to see what images are available and ensure that you are using the specific image you need
even if the image in the repository changes.

## Builds
A build is the process of transforming input parameters into a resulting object. Most often,
the process is used to transform input parameters or source code into a runnable image. A
_BuildConfig_ object is the definition of the entire build process. It can build from different
sources, including a Dockerfile, a source code repository like Git, or a Jenkins Pipeline
definition.

## Pipelines
Pipelines allow developers to define a _Jenkins_ pipeline for execution by the Jenkins
pipeline plugin. The build can be started, monitored, and managed by OpenShift Container
Platform in the same way as any other build type.

Pipeline workflows are defined in a Jenkinsfile, either embedded directly in the
build configuration, or supplied in a Git repository and referenced by the build configuration.


## Deployments
An OpenShift Deployment describes how images are deployed to pods, and how the pods are deployed
to the underlying container runtime platform. OpenShift deployments also provide the ability to transition from
an existing deployment of an image to a new one and also define hooks to be run before or after
creating the replication controller.

## Services
A Kubernetes service serves as an internal load balancer. It identifies a set of replicated
pods in order to proxy the connections it receives to them. Backing pods can be added to or
removed from a service arbitrarily while the service remains consistently available, enabling
anything that depends on the service to refer to it at a consistent address.

## Routes
_Services_ provide internal abstraction and load balancing within an
OpenShift environment, sometimes clients (users, systems, devices, etc.)
**outside** of OpenShift need to access an application. The way that external
clients are able to access applications running in OpenShift is through the
OpenShift routing layer. And the data object behind that is a _Route_.

The default OpenShift router (HAProxy) uses the HTTP header of the incoming
request to determine where to proxy the connection. You can optionally define
security, such as TLS, for the _Route_. If you want your _Services_, and, by
extension, your _Pods_,  to be accessible to the outside world, you need to
create a _Route_.

## Templates

Templates contain a collection of object definitions (BuildConfigs, DeploymentConfigs,
Services, Routes, etc) that compose an entire working project. They are useful for packaging
up an entire collection of runtime objects into a somewhat portable representation of a
running application, including the configuration of the elements.

You will use several pre-defined templates to initialize different environments for the
application. You've already used one in the previous scenario to deploy the application
into a _dev_ environment, and you'll use more in this scenario to provision the _production_
environment as well.

Consult the [OpenShift documentation](https://docs.openshift.com) for more details on these and other concepts.
