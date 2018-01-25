#### Continuous Delivery
So far you have built and deployed the app manually to OpenShift in the _dev_ environment. Although
it's convenient for local development, it's an error-prone way of delivering software when
extended to test and production environments.

Continuous Delivery (CD) refers to a set of practices with the intention of automating 
various aspects of delivery software. One of these practices is called delivery pipeline 
which is an automated process to define the steps a change in code or configuration has 
to go through in order to reach upper environments and eventually to production. 

OpenShift simplifies building CI/CD Pipelines by integrating
the popular [Jenkins pipelines](https://jenkins.io/doc/book/pipeline/overview/) into
the platform and enables defining truly complex workflows directly from within OpenShift.

The first step for any deployment pipeline is to store all code and configurations in 
a source code repository. In this workshop, the source code and configurations are stored
in a GitHub repository we've been using at [https://github.com/RedHat-Middleware-Workshops/modernize-apps-labs].
This repository has been copied locally to your environment and you've been using it ever since!

You can see the changes you've personally made using `git --no-pager status`{{execute}} to show the code changes you've made using the Git command (part of the
[Git source code management system](https://git-scm.com/)).

## Pipelines

OpenShift has built-in support for CI/CD pipelines by allowing developers to define
a [Jenkins pipeline](https://jenkins.io/solutions/pipeline/) for execution by a Jenkins
automation engine, which is automatically provisioned on-demand by OpenShift when needed.

The build can get started, monitored, and managed by OpenShift in
the same way as any other build types e.g. S2I. Pipeline workflows are defined in
a Jenkinsfile, either embedded directly in the build configuration, or supplied in
a Git repository and referenced by the build configuration. They are written using the
[Groovy scripting language](http://groovy-lang.org/).

As part of the production environment template you used in the last step, a Pipeline build
object was created. Ordinarily the pipeline would contain steps to build the project in the
_dev_ environment, store the resulting image in the local repository, run the image and execute
tests against it, then wait for human approval to _promote_ the resulting image to other environments
like test or production.

**1. Inspect the Pipeline Definition**

Our pipeline is somewhat simplified for the purposes of this Workshop. Inspect the contents of the
pipeline using the following command:

`oc describe bc/monolith-pipeline`{{execute}}

You can see the Jenkinsfile definition of the pipeline in the output:

```console
Jenkinsfile contents:
  node ('maven') {
    stage 'Build'
    sleep 5

    stage 'Run Tests in DEV'
    sleep 10

    stage 'Deploy to PROD'
    openshiftTag(sourceStream: 'coolstore', sourceTag: 'latest', namespace: 'coolstore-dev', destinationStream: 'coolstore', destinationTag: 'prod', destinationNamespace: 'coolstore-prod')
    sleep 10

    stage 'Run Tests in PROD'
    sleep 30
  }
```

Pipeline syntax allows creating complex deployment scenarios with the possibility of defining
checkpoint for manual interaction and approval process using
[the large set of steps and plugins that Jenkins provides](https://jenkins.io/doc/pipeline/steps/) in
order to adapt the pipeline to the process used in your team. You can see a few examples of
advanced pipelines in the
[OpenShift GitHub Repository](https://github.com/openshift/origin/tree/master/examples/jenkins/pipeline).

To simplify the pipeline in this workshop, we simulate the build and tests and skip any need for human input.
Once the pipeline completes, it deploys the app from the _dev_ environment to our _production_
environment using the above `openshiftTag()` method, which simply re-tags the image you already
created using a tag which will trigger deployment in the production environment.

**2. Promote the dev image to production using the pipeline**

You can use the _oc_ command line to invoke the build pipeline, or the Web Console. Let's use the
Web Console. Open the production project in the web console:

* [Web Console - Coolstore Monolith Prod](https://[[HOST_SUBDOMAIN]]-8443-[[KATACODA_HOST]].environments.katacoda.com/console/project/coolstore-prod)

Next, navigate to _Builds -> Pipelines_ and click __Start Pipeline__ next to the `coolstore-monolith` pipeline:

![Prod](/redhat-middleware-workshops/assets/developer-intro/pipe-start.png)

This will start the pipeline. **It will take a minute or two to start the pipeline** (future runs will not
take as much time as the Jenkins infrastructure will already be warmed up). You can watch the progress of the pipeline:

![Prod](/redhat-middleware-workshops/assets/developer-intro/pipe-prog.png)

Once the pipeline completes, return to the [Prod Project Overview](https://[[HOST_SUBDOMAIN]]-8443-[[KATACODA_HOST]].environments.katacoda.com/console/project/coolstore-prod)
and notice that the application is now deployed and running!

![Prod](/redhat-middleware-workshops/assets/developer-intro/pipe-done.png)

View the production app **with the blue header from before** is running by clicking: [CoolStore Production App](http://www-coolstore-prod.[[HOST_SUBDOMAIN]]-80-[[KATACODA_HOST]].environments.katacoda.com) (it may take
a few moments for the container to deploy fully.)

## Congratulations!

You have successfully setup a development and production environment for your project and can
use this workflow for future projects as well.

In the final step we'll add a human interaction element to the pipeline, so that you as a project
lead can be in charge of approving changes.

## More Reading

* [OpenShift Pipeline Documentation](https://docs.openshift.com/container-platform/3.7/dev_guide/dev_tutorials/openshift_pipeline.html)
