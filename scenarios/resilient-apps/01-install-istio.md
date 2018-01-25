In this step, we'll install Istio into our OpenShift platform.

In order to install Istio, you must be logged in as `admin`. This is required as this
user will need to run things in a privileged way, or even with containers as root.

Run the following to login as admin:

`oc login [[HOST_SUBDOMAIN]]-8443-[[KATACODA_HOST]].environments.katacoda.com -u admin -p admin --insecure-skip-tls-verify=true`{{execute}}

**If you are unable to login as admin or get any failures, ask an instructor for help.**

Because this scenario does not use any of the previous projects, let's shut down (but not delete) the services
to save memory and CPU. Execute this command to _scale_ the services down to 0 instances each:

`oc scale --replicas=0 dc/coolstore dc/coolstore-postgresql -n coolstore-dev ; \
 oc scale --replicas=0 dc/inventory dc/inventory-database -n inventory ; \
 oc scale --replicas=0 dc/catalog dc/catalog-database -n catalog ; \
 oc scale --replicas=0 dc/cart -n cart`{{execute}}

Next, run the following command:

`sh ~/install-istio.sh`{{execute}}

This command:

* Creates the project `istio-system` as the location to deploy all the components
* Adds necessary permissions
* Deploys Istio components
* Deploys additional add-ons, namely Prometheus, Grafana, Service Graph and Jaeger Tracing
* Exposes routes for those add-ons and for Istio's Ingress component

We'll use the above components througout this scenario, so don't worry if you don't know what they do!

Istio consists of a number of components, and you should wait for it to be completely initialized before continuing.
Execute the following commands to wait for the deployment to complete and result `deployment xxxxxx successfully rolled out` for each deployment:

`oc rollout status -w deployment/istio-pilot && \
 oc rollout status -w deployment/istio-mixer && \
 oc rollout status -w deployment/istio-ca && \
 oc rollout status -w deployment/istio-ingress && \
 oc rollout status -w deployment/prometheus && \
 oc rollout status -w deployment/grafana && \
 oc rollout status -w deployment/servicegraph && \
 oc rollout status -w deployment/jaeger-deployment`{{execute}}

While you wait for the command to report success you can read a bit more about the [Istio](https://istio.io/docs) architecture below:

## Istio Details

An Istio service mesh is logically split into a _data plane_ and a _control plane_.

The _data plane_ is composed of a set of intelligent proxies (_Envoy_ proxies) deployed as _sidecars_ to your application's pods in OpenShift that mediate and control all network communication between microservices.

The _control plane_ is responsible for managing and configuring proxies to route traffic, as well as enforcing policies at runtime.

The following diagram shows the different components that make up each plane:

![Istio Arch](/redhat-middleware-workshops/assets/resilient-apps/arch.png)

#### Istio Components

##### Envoy
Envoy is a high-performance proxy developed in C++ which handles all inbound and outbound traffic for all services in the service mesh. Istio leverages Envoy’s many built-in features such as dynamic service discovery, load balancing, TLS termination, HTTP/2 & gRPC proxying, circuit breakers, health checks, staged rollouts with %-based traffic split, fault injection, and rich metrics.

Envoy is deployed as a sidecar to application services in the same Kubernetes pod. This allows Istio to extract a wealth of signals about traffic behavior as attributes, which in turn it can use in Mixer to enforce policy decisions, and be sent to monitoring systems to provide information about the behavior of the entire mesh.

##### Mixer
Mixer is a platform-independent component responsible for enforcing access control and usage policies across the service mesh and collecting telemetry data from the Envoy proxy and other services. The proxy extracts request level attributes, which are sent to Mixer for evaluation.

##### Pilot
Pilot provides service discovery for the Envoy sidecars, traffic management capabilities for intelligent routing (e.g., A/B tests, canary deployments, etc.), and resiliency (timeouts, retries, circuit breakers, etc.). It converts a high level routing rules that control traffic behavior into Envoy-specific configurations, and propagates them to the sidecars at runtime. Pilot abstracts platform-specifc service discovery mechanisms and synthesizes them into a standard format consumable by any sidecar that conforms to the Envoy data plane APIs.

##### Istio-Auth
Istio-Auth provides strong service-to-service and end-user authentication using mutual TLS, with built-in identity and credential management. It can be used to upgrade unencrypted traffic in the service mesh, and provides operators the ability to enforce policy based on service identity rather than network controls.

##### Add-ons
Several components are used to provide additional visualizations, metrics, and tracing functions:

* [Prometheus](https://prometheus.io/) - Systems monitoring and alerting toolkit
* [Grafana](https://grafana.com/) - Allows you to query, visualize, alert on and understand your metrics
* [Jaeger Tracing](http://jaeger.readthedocs.io/) - Distributed tracing to gather timing data needed to troubleshoot latency problems in microservice architectures
* [Servicegraph](https://istio.io/docs/tasks/telemetry/servicegraph.html#about-the-servicegraph-add-on) - generates and visualizes a graph of services within a mesh

We will use these in future steps in this scenario!

Check out the [Istio docs](https://istio.io/docs) for more details.

Is your Istio deployment complete? If so, then you're ready to move on!