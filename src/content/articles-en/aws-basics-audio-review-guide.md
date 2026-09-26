---
title: "[Listen] The AWS Fundamentals Series, Fully Recapped"
description: "An audio-learning article that reviews all 10 articles of the AWS Fundamentals series by ear, during a commute or while doing chores. No tables, diagrams, or bullet points — just spoken-style prose meant to be read aloud by a browser's text-to-speech feature."
series: "aws-basics"
subSeries: "audio"
order: 11
tags: ["aws", "audio-review", "infra"]
emoji: "🎧"
pubDate: 2026-09-26
---

This article is an audio-learning recap for anyone who's already read all ten articles in the AWS Fundamentals series. Use your browser's or phone's text-to-speech feature and let it play in the background during a commute or while doing chores. There are no diagrams, tables, or code here — just spoken-style prose, stitching the whole series back together into a single, continuous thread.

The series started with an unglamorous fundamental that trips everyone up at some point: EC2's key pair and a subnet's reserved IPs. A key pair's private key can only be downloaded once, and lose it, and it's gone for good. And inside a subnet, a network address, a broadcast address, and a handful of addresses AWS itself reserves all exist, so the number of IPs you can actually hand out is smaller than the CIDR's number suggests on the surface. Design without knowing this, and you're guaranteed to trip over it later.

Next came the hands-on of actually launching an EC2 instance and publishing a web server. Correctly opening a security group — a per-instance firewall — connecting via SSH, and running Nginx. What many people overlook here is the difference between merely stopping an instance and fully terminating it, and the hard-to-notice cost trap where an Elastic IP, a fixed public IP, gets billed on its own while it's not attached to any instance.

Then came credential handling, one of the areas where real-world incidents happen most easily. An IAM role lets you securely access an AWS service without ever writing an access key into your code at all. Underneath, a mechanism called STS automatically issues and swaps out short-lived, temporary credentials continuously. And the reason IMDSv2, the newer version of the instance metadata service, is increasingly becoming mandatory turned out to be a defense against a specific attack structure: exploiting a server-side vulnerability to unintentionally steal that very credential.

The S3 discussion covered the public access block — one more layer of safety that exists separate from bucket policies or ACLs. This is a concrete implementation of defense in depth: even if a careless mistake happens, one last line of defense still stops it. And enable versioning, and deletion no longer actually erases a file — it just adds a special marker called a delete marker, letting you restore it later.

Next came the hands-on of building a VPC entirely by hand, instead of relying on the default VPC. The single most important insight here was that the distinction between a "public subnet" and a "private subnet" isn't an AWS-side attribute — it's purely a result determined by the content of the route table tied to that subnet. An IGW enables two-way communication, while a NAT gateway only enables one-way communication initiated from the private side — two roles that look similar but are actually entirely different.

Inside that private subnet, you also built RDS for real, and experienced fetching the DB password from Secrets Manager at runtime instead of ever writing it into your code. Secrets Manager can periodically and automatically rotate a password, and the app's code never has to change at all — the credential just keeps quietly swapping out underneath it.

A NAT gateway carries the real-world constraint of being billed based on the volume of data passing through it. The solution to that problem is the VPC endpoint. Two entirely different kinds exist: the free gateway type, supporting only S3 and DynamoDB, and the interface type, billed via an ENI, supporting most other services.

The backup discussion touched on the underlying mechanism that an EBS snapshot is actually an incremental backup. Even though every snapshot after the first only stores the difference from the one before it, deleting the very first snapshot still leaves later ones independently, correctly restorable, because AWS internally manages block-level reference relationships.

The final two articles were educational, defense-focused security hands-on labs. The first reproduced, inside a test environment, just how far an excessively broad IAM policy widens the blast radius when credentials leak, then fixed it into a least-privilege policy scoped down with Resource and Condition. IAM Access Analyzer can even automatically generate a draft least-privilege policy based on actual usage records. The second combined CloudTrail and GuardDuty, two services with entirely different roles. CloudTrail is purely a service that endlessly records every API call without applying any judgment, while GuardDuty analyzes that log and alerts you only on what it judges anomalous. Detection and the after-the-fact investigation that follows only become a mechanism that actually works in real-world operations once both are combined.

Looking back across all ten articles, one consistent pattern emerges. The public access block, the IAM role, the VPC endpoint, the least-privilege policy — every one of them was a different, concrete implementation of the same design philosophy: default to the safe side, and deliberately, explicitly open up only the specific range that's genuinely needed. Are you widening the scope more than necessary just to get something working for now? Asking yourself that question, over and over, is the perspective a top-1% engineer carries away from this series. And that's the recap of the AWS Fundamentals series, complete.
