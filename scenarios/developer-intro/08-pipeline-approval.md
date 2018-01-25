In previous steps you used an OpenShift Pipeline to automate the process of building and
deploying changes from the dev environment to production.

In this step, we'll add a final checkpoint to the pipeline which will require you as the project
lead to approve the final push to production.

**1. Edit the pipeline**

Ordinarily your pipeline definition would be checked into a source code management system like Git,
and to change the pipeline you'd edit the _Jenkinsfile_ in the source base. For this workshop we'll
just edit it directly to add the necessary changes. You can edit it with the `oc` command but we'll
use the Web Console.

Open the `monolith-pipeline` configuration page in the Web Console (you can navigate to it from
_Builds -> Pipelines_ but here's a quick link):

* [Pipeline Config page](https://[[HOST_SUBDOMAIN]]-8443-[[KATACODA_HOST]].environments.katacoda.com/console/project/coolstore-prod/browse/pipelines/monolith-pipeline?tab=configuration)

On this page you can see the pipeline definition. Click _Actions -> Edit_ to edit the pipeline:

![Prod](/redhat-middleware-workshops/assets/developer-intro/pipe-edit.png)

In the pipeline definition editor, add a new stage to the pipeline, just before the `Deploy to PROD` step:

> **NOTE**: You will need to copy and paste the below code into the right place as shown in the below image.

```groovy
  stage 'Approve Go Live'
  timeout(time:30, unit:'MINUTES') {
    input message:'Go Live in Production (switch to new version)?'
  }
```

Your final pipeline should look like:

![Prod](/redhat-middleware-workshops/assets/developer-intro/pipe-edit2.png)

Click **Save**.

**2. Make a simple change to the app**

With the approval step in place, let's simulate a new change from a developer who wants to change
the color of the header in the coolstore back to the original (black) color.

As a developer you can easily un-do edits you made earlier to the CSS file using the source control
management system (Git). To revert your changes, execute:

`git checkout src/main/webapp/app/css/coolstore.css`{{execute}}

Next, re-build the app once more:

`mvn clean package -Popenshift`{{execute}}

And re-deploy it to the dev environment using a binary build just as we did before:

`oc start-build -n coolstore-dev coolstore --from-file=deployments/ROOT.war`{{execute}}

Now wait for it to complete the deployment:

`oc -n coolstore-dev rollout status -w dc/coolstore`{{execute}}

And verify that the original black header is visible in the dev application:

* [Coolstore - Dev](http://www-coolstore-dev.[[HOST_SUBDOMAIN]]-80-[[KATACODA_HOST]].environments.katacoda.com)

![Prod](/redhat-middleware-workshops/assets/developer-intro/pipe-orig.png)

While the production application is still blue:

* [Coolstore - Prod](http://www-coolstore-prod.[[HOST_SUBDOMAIN]]-80-[[KATACODA_HOST]].environments.katacoda.com)

![Prod](/redhat-middleware-workshops/assets/developer-intro/nav-blue.png)

We're happy with this change in dev, so let's promote the new change to prod, using the new approval step!

**3. Run the pipeline again**

Invoke the pipeline once more by clicking **Start Pipeline** on the [Pipeline Config page](https://[[HOST_SUBDOMAIN]]-8443-[[KATACODA_HOST]].environments.katacoda.com/console/project/coolstore-prod/browse/pipelines/monolith-pipeline)

The same pipeline progress will be shown, however before deploying to prod, you will see a prompt in the pipeline:

![Prod](/redhat-middleware-workshops/assets/developer-intro/pipe-prompt.png)

Click on the link for `Input Required`. This will open a new tab and direct you to Jenkins itself, where you can login with
the same credentials as OpenShift:

* Username: `developer`
* Password: `developer`

Accept the browser certificate warning and the Jenkins/OpenShift permissions, and then you'll find yourself at the approval prompt:

![Prod](/redhat-middleware-workshops/assets/developer-intro/pipe-jenkins-prompt.png)

**3. Approve the change to go live**

Click **Proceed**, which will approve the change to be pushed to production. You could also have
clicked **Abort** which would stop the pipeline immediately in case the change was unwanted or unapproved.

Once you click **Proceed**, you will see the log file from Jenkins showing the final progress and deployment.

Wait for the production deployment to complete:

`oc rollout -n coolstore-prod status dc/coolstore-prod`{{execute}}

Once it completes, verify that the production application has the new change (original black header):

* [Coolstore - Prod](http://www-coolstore-prod.[[HOST_SUBDOMAIN]]-80-[[KATACODA_HOST]].environments.katacoda.com)

![Prod](/redhat-middleware-workshops/assets/developer-intro/pipe-orig.png)

## Congratulations!

You have added a human approval step for all future developer changes. You now have two projects that can be visualized as:

![Prod](/redhat-middleware-workshops/assets/developer-intro/goal.png)

