In the previous scenario you learned how to take an existing application to the cloud with JBoss EAP and OpenShift,
and you got a glimpse into the power of OpenShift for existing applications.

In this scenario you will go deeper into how to use the OpenShift Container Platform as a developer to build,
deploy, and debug applications. We'll focus on the core features of OpenShift as it relates to developers, and
you'll learn typical workflows for a developer (develop, build, test, deploy, debug, and repeat).

## Let's get started

If you are not familiar with the OpenShift Container Platform, it's worth taking a few minutes to understand
the basics of the platform as well as the environment that you will be using for this workshop.

The goal of OpenShift is to provide a great experience for both Developers and System Administrators to
develop, deploy, and run containerized applications.  Developers should love using OpenShift because it
enables them to take advantage of both containerized applications and orchestration without having the
know the details.  Developers are free to focus on their code instead of spending time writing Dockerfiles
and running docker builds.

Both Developers and Operators communicate with the OpenShift Platform via one of the following methods:

* **Command Line Interface** - The command line tool that we will be using as part of this training is called the *oc* tool. You used this briefly
in the last scenario. This tool is written in the Go programming language and is a single executable that is provided for
Windows, OS X, and the Linux Operating Systems.
* **Web Console** -  OpenShift also provides a feature rich Web Console that provides a friendly graphical interface for
interacting with the platform. You can always access the Web Console using the link provided just above
the Terminal window on the right:
 * ![OpenShift Console Tab](/redhat-middleware-workshops/assets/developer-intro/openshift-console-tab.png)
* **REST API** - Both the command line tool and the web console actually communicate to OpenShift via the same method,
the REST API.  Having a robust API allows users to create their own scripts and automation depending on
their specific requirements.  For detailed information about the REST API, check out the [official documentation](https://docs.openshift.org/latest/rest_api/index.html).
You will not use the REST API directly in this workshop.

During this workshop, you will be using both the command line tool and the web console.  However, it
should be noted that there are plugins for several integrated development environments as well.
For example, to use OpenShift from the Eclipse IDE, you would want to use the official [JBoss Tools](https://tools.jboss.org/features/openshift.html) plugin.

Now that you know how to interact with OpenShift, let's focus on some core concepts that you as a developer
will need to understand as you are building your applications!