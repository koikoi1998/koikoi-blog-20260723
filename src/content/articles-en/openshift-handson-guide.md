---
title: "A \"Top 1%\" Hands-On Lab: Running a Container Application on OpenShift Local"
description: "Using OpenShift Local to build a single-node OpenShift cluster on one PC, this hands-on lab walks through automatically building and deploying a sample application from source code, exposing it externally via a Route, and scaling it — all by actually running the commands yourself."
series: "openshift"
order: 2
tags: ["openshift", "kubernetes", "container", "handson"]
emoji: "🛠️"
pubDate: 2026-09-20
---

## Introduction

- **What You'll Learn From This Article**: This article puts the concepts covered in [Understanding What OpenShift Actually Is From a "Top 1%" Perspective](/en/articles/openshift-guide) into practice, hands-on. Using **OpenShift Local** (Red Hat's official tool for learning and testing, which builds a single-node OpenShift cluster on one PC), you'll walk through automatically building and deploying a sample application from source code, exposing it externally via a Route, and scaling it (changing its replica count).
- **Intended Audience**: This article is aimed at engineers who've read [Understanding What OpenShift Actually Is From a "Top 1%" Perspective](/en/articles/openshift-guide) and want to actually get their hands on OpenShift.
- **Estimated Reading Time**: About 35 minutes (including actual hands-on time)

This article is part of the [Top 1% Series' full article guide](/en/sitemap), and the second article in the [OpenShift Series](/en/sitemap#series-list).

## Prerequisites

- **OpenShift Local (formerly CodeReady Containers, CRC)**: A tool provided by Red Hat that builds a single-node OpenShift cluster inside a virtual machine running on a single PC. It's intended for learning and testing, not production use.

## Prerequisites for This Hands-On Lab

- **Hardware requirements**: A CPU with virtualization support enabled, 16GB of memory or more recommended, and at least 35GB of free disk space.
- **A Red Hat account**: Using OpenShift Local requires registering for a free Red Hat account, and obtaining a **pull secret** (authentication credentials for retrieving container images) available through that account.

## Step 0: Setting Up OpenShift Local

### Registering an Account and Obtaining a Pull Secret

Create a free account on Red Hat's Developer site, and download the pull secret for your environment from OpenShift Local's download page ahead of time.

### Installing and Setting Up OpenShift Local

```bash
# After extracting the downloaded executable, place it somewhere in your PATH, then:
crc setup
```

`crc setup` prepares the virtualization environment OpenShift Local needs to run (checking the hypervisor, configuring networking, and so on). Once it completes, start the cluster.

```bash
crc start --pull-secret-file /path/to/pull-secret.txt
```

This command actually starts a single-node OpenShift cluster as a local virtual machine. The first run takes anywhere from a few to over ten minutes. Once it completes, it displays the information (a URL and initial password) you need to log into the cluster.

## Step 1: Logging Into the Web Console and the oc CLI

Visiting the URL displayed after `crc start` completes, in your browser, lets you log into OpenShift's web console. Also log in via `oc` (the OpenShift CLI), used for command-line operations.

```bash
# Run the exact command shown in crc start's output (example)
oc login -u developer -p developer https://api.crc.testing:6443
```

```bash
# Check the current login state / connected cluster
oc whoami
oc project
```

## Step 2: Deploying a Sample Application (Source-to-Image)

Here you'll actually experience the **Source-to-Image (S2I)** mechanism covered in [Understanding What OpenShift Actually Is From a "Top 1%" Perspective](/en/articles/openshift-guide). This uses a publicly available sample Node.js application repository as an example.

```bash
# Create a new working Project (Namespace)
oc new-project handson-demo

# Just specifying a Git repository automatically selects the build image,
# building and deploying the application's image from source code
oc new-app nodejs~https://github.com/sclorg/nodejs-ex.git --name=hello-node
```

Running `oc new-app` makes OpenShift detect the content of the specified Git repository (in this case, that it's a Node.js application) and automatically starts a build using the corresponding builder image. You can check the build's progress with the following commands.

```bash
# Check the build's progress in real time
oc logs -f bc/hello-node

# Check whether the Pod has actually started
oc get pods
```

If you see a Pod with `STATUS` showing `Running`, the application deployment succeeded.

## Step 3: Exposing the Application Externally With a Route

By default, the deployed application is only accessible from within the cluster. Create a **Route**, covered in [Understanding What OpenShift Actually Is From a "Top 1%" Perspective](/en/articles/openshift-guide), to make it accessible from outside.

```bash
# Create a Route for the Service, assigning it a hostname for external access
oc expose service/hello-node

# Check the assigned hostname
oc get route hello-node
```

Visiting the displayed hostname in your browser shows the sample application's screen. **Try confirming that this Route's creation, just like the binding configuration covered in [Understanding How IIS and ASP.NET Work from a "Top 1%" Perspective](/en/articles/iis-fundamentals-guide), routes external requests to a specific application based on hostname.**

## Step 4: Experiencing Scaling (Changing the Replica Count)

Here you'll experience **declarative replica-count management via a Deployment**, one of Kubernetes's and OpenShift's core characteristics.

```bash
# Check the current Pod count (usually 1)
oc get pods

# Change the replica count to 3
oc scale deployment/hello-node --replicas=3

# After a few seconds, confirm the Pod count has grown to 3
oc get pods
```

You'll see the behavior where **the actual Pod count is automatically adjusted to match the specified replica count (3).** As a test, try manually deleting one of the Pods.

```bash
# Check the Pod names, then delete one of them
oc delete pod <pod-name>

# Wait a moment and check again — a new Pod gets automatically
# replenished, always maintaining a count of 3
oc get pods
```

**This behavior — automatically maintaining the actual state to always match the declared state — is the core design philosophy of Kubernetes and OpenShift.**

## Step 5: Cleaning Up

Once you're done testing, delete the Project you created, and stop and delete the cluster itself.

```bash
# Delete the Project you created (all resources within it are deleted too)
oc delete project handson-demo

# Stop the cluster (you can resume it next time with crc start)
crc stop

# To completely delete the cluster
crc delete
```

## Common Errors and How to Handle Them

- **`crc start` fails with an error about virtualization support**: Check your BIOS/UEFI settings to confirm the CPU's virtualization support feature (Intel VT-x, AMD-V) is enabled.
- **A pull secret format error**: Check that the downloaded pull secret file doesn't contain extra line breaks or quotation marks.
- **A build via `oc new-app` fails**: Check the build log with `oc logs -f bc/<build-name>`, and check for network reachability issues (access to the Git repository, or reachability to where the builder image is fetched from).

## Summary

- OpenShift Local lets you build a single-node OpenShift cluster on a single PC for learning and testing purposes.
- Just running `oc new-app` and specifying a Git repository automatically builds and deploys a container image from source code, via the Source-to-Image mechanism.
- Creating a Route lets you expose a deployed application externally, based on hostname.
- Changing the replica count with `oc scale`, and watching a Pod get automatically replenished after manual deletion, let you experience the core design philosophy of Kubernetes and OpenShift: declarative state management.

**What to Keep in Mind From Today**
1. Always run a state-checking command like `oc get pods` before and after an operation, and build the habit of visually confirming the change.
2. Experience the idea of declarative state management by watching a new Pod get automatically replenished even after you manually delete one.

## References

- [Red Hat OpenShift Local | Red Hat Developer](https://developers.redhat.com/products/openshift-local/overview)
- [Understanding builds | Red Hat OpenShift Documentation](https://docs.openshift.com/container-platform/latest/cicd/builds/understanding-image-builds.html)
- [Configuring Routes | Red Hat OpenShift Documentation](https://docs.openshift.com/container-platform/latest/networking/routes/route-configuration.html)
