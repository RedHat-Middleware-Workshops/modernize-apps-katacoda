**1. Rebuild and re-deploy**

With our health check in place, lets rebuild and redeploy using the same command as before:

`mvn fabric8:undeploy clean fabric8:deploy -Popenshift`{{execute T1}}

You should see a **BUILD SUCCESS** at the end of the build output.

During build and deploy, you'll notice WildFly Swarm adding in health checks for you:

```console
[INFO] F8: wildfly-swarm-health-check: Adding readiness probe on port 8080, path='/health', scheme='HTTP', with initial delay 10 seconds
[INFO] F8: wildfly-swarm-health-check: Adding liveness probe on port 8080, path='/health', scheme='HTTP', with initial delay 180 seconds
```

To verify that everything is started, run the following command and wait for it report
`replication controller "inventory-xxxx" successfully rolled out`

`oc rollout status -w dc/inventory`{{execute T1}}

Once the project is deployed, you should be able to access the health check logic
at the `/health` endpoint using a simple _curl_ command. This is the same API that OpenShift will repeatedly poll to determine application health.

Click here to try it (you may need to try a few times until the project is fully deployed):

``curl http://inventory-inventory.[[HOST_SUBDOMAIN]]-80-[[KATACODA_HOST]].environments.katacoda.com/health``{{execute T1}}

You should see a JSON response like:

```
{"checks": [
{"id":"service-state","result":"UP"}],
"outcome": "UP"
}
```

You can see the definition of the health check from the perspective of OpenShift:

`oc describe dc/inventory | egrep 'Readiness|Liveness'`{{execute T1}}

You should see:

```console
    Liveness:	http-get http://:8080/health delay=180s timeout=1s period=10s #success=1 #failure=3
    Readiness:	http-get http://:8080/health delay=10s timeout=1s period=10s #success=1 #failure=3
```

**2. Adjust probe timeout**

The various timeout values for the probes can be configured in many ways. Let's tune the _liveness probe_ initial delay so that
we don't have to wait 3 minutes for it to be activated. Use the **oc** command to tune the
probe to wait 20 seconds before starting to poll the probe:

`oc set probe dc/inventory --liveness --initial-delay-seconds=30`{{execute T1}}

And verify it's been changed (look at the `delay=` value for the Liveness probe):

`oc describe dc/inventory | egrep 'Readiness|Liveness'`{{execute T1}}

```console
    Liveness:	http-get http://:8080/health delay=30s timeout=1s period=10s #success=1 #failure=3
    Readiness:	http-get http://:8080/health delay=10s timeout=1s period=10s #success=1 #failure=3
```

> You can also edit health checks from the OpenShift Web Console, for example click on [this link](https://[[HOST_SUBDOMAIN]]-8443-[[KATACODA_HOST]].environments.katacoda.com/console/project/inventory/edit/health-checks?kind=DeploymentConfig&name=inventory)
to access the health check edit page for the Inventory deployment.

In the next step we'll exercise the probe and watch as it fails and OpenShift recovers the application.