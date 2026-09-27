---
title: "Hands-On Prep Manual: Basic Operation of the AWS Management Console — Navigating the Screens for Major Services"
description: "A prep manual bundling together the actual console screen operations that this blog's AWS hands-on articles tend to skip over, saying only 'create this with these settings.' Covers handling the root user after account creation, choosing a region, and how to create a VPC, EC2 instance, security group, S3 bucket, IAM user, and IAM role in the console, for absolute beginners."
series: "handson-prep"
subSeries: "handson"
order: 6
tags: ["aws", "handson", "beginner", "infrastructure"]
emoji: "🧰"
pubDate: 2026-09-26
---

## Introduction

- **What You'll Learn From This Article**: This blog's AWS Fundamentals series hands-on articles deliberately skip over the fine detail of exactly which screen and which button to click in the actual management console, saying only things like "create a security group with these settings" (AWS's GUI is updated frequently, and writing that fine detail out risks going stale almost immediately). This article bundles together that often-skipped part — the basic mindset right after creating an account, and how to operate the major services (VPC, EC2, security groups, S3, IAM) in the console — for absolute beginners.
- **Intended Audience**: Readers who've created an AWS account but have barely touched the management console, and have gotten lost trying to figure out where to look when another hands-on article says "create such-and-such."
- **Estimated Reading Time**: About 15 minutes

This article is part of the [Top 1% Series Complete Article Guide](/en/sitemap), one of several theme-split articles from the [Hands-On Prep Manual](/en/articles/handson-prep-guide). For the actual hands-on flow, see [The Top 1% Hands-On for Launching an EC2 Instance and Publishing a Web Server](/en/articles/aws-ec2-webserver-handson-guide) and similar articles.

## Step 1: What to Understand Right After Creating Your Account

Creating an AWS account automatically creates an account called the **root user**. **This root user has the strongest possible permissions — it can do literally anything to that account, including changing billing information.** Whether it's real-world work or your own personal test environment, continuing to use the root user for everyday operations isn't recommended. Once you log in as the root user, the basic practice is to first create an **IAM user** (covered in Step 6) for everyday operations, and log in with that from then on.

It's also strongly recommended to set up a **budget alert** (a setting that emails you once spending crosses a certain amount) right after creating your account, from the "Billing and Cost Management" dashboard, so you notice unexpected charges during testing.

## Step 2: Choose a Region

The place name displayed in the top-right corner of the console (like "Tokyo" or "N. Virginia") is the selection field for the **region** — the geographic area AWS provides its service from. **Most AWS services create resources that exist only within the region currently selected.** Create an EC2 instance in one region, and it won't show up on a screen where a different region is selected. The most common source of beginner confusion — "the resource I created isn't anywhere to be found" — usually traces back to selecting the wrong region. If you're accessing from Japan, choosing "Asia Pacific (Tokyo)" for lower latency is the standard choice.

## Step 3: Understand Where the VPC and Internet Gateway Fit

Each region automatically comes with a **default VPC** set up when the account is created. Open the VPC console screen (search for "VPC"), and you'll find this default VPC, its associated subnets, and an **internet gateway** (the doorway between the VPC and the internet) already attached and ready to go.

When you're first getting started with AWS, just using this default VPC as-is lets you publish an EC2 instance to the internet without ever having to think about creating or attaching an internet gateway yourself. **The steps for building your own VPC from scratch are covered in [The Top 1% Hands-On for Building a VPC With Public/Private Subnets Yourself](/en/articles/aws-vpc-handson-guide).** It's recommended to first get comfortable with AWS's basic operations here and in the EC2 hands-on, then move on to that one.

## Step 4: Launch an EC2 Instance

Open the EC2 console and click "Launch instance," then work through the wizard-style screen.

1. **Name and tags**: Enter a name for the instance (just a label to help you tell it apart later).
2. **AMI (Amazon Machine Image)**: Choose the OS type. Ubuntu Server and Amazon Linux, which qualify for the free tier, are explicitly labeled "Free tier eligible" on screen.
3. **Instance type**: Choose one that qualifies for the free tier, like `t2.micro` or `t3.micro`.
4. **Key pair**: Choose "Create new key pair," give it a name, and the private key file (`.pem`) downloads automatically. **This download only happens once — you can't download it again later.**
5. **Network settings**: The VPC and subnet can stay as the default VPC from Step 3. Confirm "Auto-assign public IP" is enabled.
6. **Security group**: Create a new one, or select one you already created in Step 5.

Once everything's set, click "Launch instance." It sits in a "pending" state right after launch, and switches to "running" shortly after.

## Step 5: Create a Security Group

From the left-side menu on the EC2 console screen, select "Security Groups," then click "Create security group." After entering a name and description, add **inbound rules** (rules permitting inbound traffic from outside to this instance) one at a time with the "Add rule" button, as many as you need.

When a hands-on article specifies something like "SSH: port 22, source my IP," enter it like this:

- **Type**: Choose "SSH" from the dropdown, and the port number (22) fills in automatically.
- **Source**: Choose "My IP," and your current global IP address fills in automatically.

**Outbound rules (traffic from this instance to the outside) permit everything by default, so most hands-on labs don't require any changes there.**

## Step 6: Create an S3 Bucket

Open the S3 console and click "Create bucket."

1. **Bucket name**: Must be unique across the entire world. A name someone else is already using can't be reused.
2. **Region**: The same region selection field covered in Step 2.
3. **Block all public access**: Checked by default. Uncheck this only when you deliberately want to publish it, as in [The Top 1% Hands-On for Publishing a Static Website From an S3 Bucket](/en/articles/aws-s3-static-website-handson-guide).

## Step 7: Create an IAM User and an IAM Role

Open the IAM console. **IAM users** and **IAM roles** sit right next to each other in the menu on screen, but they serve entirely different purposes.

**Creating an IAM user** (an account for a human who logs into the console day to day):

1. From the left-side menu, select "Users" → "Create user."
2. Enter a username, and checking "Provide user access to the AWS Management Console" turns it into an account with a password that can log into the console.
3. On the permissions screen, either attach an existing policy directly, or add it to a group to grant permissions.

**Creating an IAM role** (temporary permissions given to an AWS resource itself, like EC2):

1. From the left-side menu, select "Roles" → "Create role."
2. Choose "AWS service" for **Trusted entity type**, and "EC2" for **Use case** (this specifies what kind of AWS resource this role can be attached to).
3. On the next screen, check the permission policy to grant this role (for example, `AmazonS3ReadOnlyAccess`).
4. Enter a role name and create it.

A role you've created can be attached when launching an EC2 instance (there's an "IAM role" field in Step 4's wizard) or added later from the instance's settings screen after launch. **[The Top 1% Hands-On for Never Giving EC2 an Access Key With an IAM Role](/en/articles/aws-iam-role-handson-guide) actually uses this exact step.**

## Common Misconceptions and Pitfalls

- **Misconception 1: "The EC2 instance I created is nowhere to be found."**
  In most cases, the selected region differs between when you created it and when you're looking for it. Check the region shown in the top-right corner.
- **Misconception 2: "IAM users and IAM roles are basically the same thing with similar names."**
  An IAM user is an account for a human to log in with; an IAM role is temporary permissions given to an AWS resource itself. Their purposes are entirely different.
- **Misconception 3: "Security group outbound rules need the same fine-grained per-case setup as inbound rules."**
  Outbound permits everything by default, so no change is needed unless you specifically want to restrict it.

## Summary

- Don't use the root user for everyday operations — create an IAM user first and use that from then on.
- Most AWS services are independent per region — if a resource is nowhere to be found, check the region first.
- When first starting out, just use the default VPC as-is; building your own VPC is covered in a separate hands-on.
- An IAM user (for humans) and an IAM role (for AWS resources) are entirely different mechanisms serving different purposes.

## References

- [AWS Management Console | AWS Documentation](https://docs.aws.amazon.com/awsconsolehelpdocs/latest/gsg/getting-started.html)
- [IAM Identities (users, groups, and roles) | AWS Documentation](https://docs.aws.amazon.com/IAM/latest/UserGuide/id.html)
