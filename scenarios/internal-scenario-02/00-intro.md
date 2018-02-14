Most Java developers use build tools like Gradle or Maven, which is designed to pull down dependencies at build time. When using this locally the build tool will cache dependencies and only update them if the checksum isn't correct. However, Since the build process in OpenShift is ephemeral this means that each build is like a clean build and will need to pull down all the dependent artifacts. Let's do some assumptions and see how much data that translates to.

Assumptions:
 * A typical web app will at a clean build pull down 100 MB of dependencies.
 * Our application has 10 developers
 * Each developer deploy 30 times a day.

This means that for this project on a normal working day OpenShift builds will download 30GB. And that is fairly low counted. We have customer that have >300 MB of dependencies and +100 developers that are used to build hundreds of times a day. There are techniques to solve this, by using centrally hosted maven repositories or by using incremental builds, but default OpenShift does not do any of that out-of-the box.

Not to mention that the build process in Java is fairly heavy and uses a lot of CPU. This CPU load was previously distributed on developers laptops and with S2I we are centralizing. This may sound good, since we can sell more OpenShift sockets, but in reality at customers what will happen is that developers will see build times of 10-15 min.

Most enterprise developers works in small development cycle and like to deploy and test their changes several times an hour and a short build time is crucial for development efficiency.  

OpenShift S2I is a great concept, but using the full source to image build process is in many cases just to long for developer efficiency.

In this scenario we will build and deploy the application using both the full S2I process, but also try it with the binary build process. 