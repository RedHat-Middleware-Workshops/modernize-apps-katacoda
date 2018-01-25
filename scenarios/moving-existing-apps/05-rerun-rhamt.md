In this step we will re-run the RHAMT report to verify our migration was successfu.

**1. Run the RHAMT CLI against the project**

Click on the below command to clean the old build artifacts and re-execute the RHAMT CLI and analyze the new project:

```
mvn clean && \
~/rhamt-cli-4.0.0.Beta4/bin/rhamt-cli \
  --sourceMode \
  --input ~/projects/monolith \
  --output ~/rhamt-reports/monolith \
  --overwrite \
  --source weblogic \
  --target eap:7 \
  --packages com.redhat weblogic
```{{execute T1}}

**Wait for it to complete before continuing!**. You should see `Report created: /root/rhamt-reports/monolith/index.html`.

**2. View the results**

[Reload the report web page](https://[[HOST_SUBDOMAIN]]-9000-[[KATACODA_HOST]].environments.katacoda.com/monolith)

And verify that it now reports 0 Story Points:

You have successfully migrated
this app to JBoss EAP, congratulations!

![Issues](/redhat-middleware-workshops/assets/moving-existing-apps/project-issues-story.png)

## Migration Complete!

Now that we've migrated the app, let's deploy it and test it out and start to explore some of the features that JBoss EAP
plus Red Hat OpenShift bring to the table.

