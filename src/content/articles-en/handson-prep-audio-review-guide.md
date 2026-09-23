---
title: "[Listen] The Hands-On Prep Series, Fully Recapped"
description: "An audio-learning article that reviews all 5 articles of the Hands-On Prep series by ear, during a commute or while doing chores. No tables, diagrams, or bullet points — just spoken-style prose meant to be read aloud by a browser's text-to-speech feature."
series: "handson-prep"
subSeries: "audio"
order: 6
tags: ["handson-prep", "audio-review", "infra"]
emoji: "🎧"
pubDate: 2026-09-24
---

This article is an audio-learning recap for anyone who's already read all five articles in the Hands-On Prep series. Use your browser's or phone's text-to-speech feature and let it play in the background during a commute or while doing chores. There are no diagrams, tables, or code here — just spoken-style prose, stitching the whole series back together into a single, continuous thread.

This series quietly laid the groundwork underneath every other hands-on article on this blog. It opened with the basics of creating a VM in Proxmox VE and installing an OS on it — the very first step shared in common by every hands-on lab here. Written for readers brand new to both virtualization environments and Linux server operation, it aimed to be the first stepping stone on a much longer journey ahead.

Next came what to do right after logging into that freshly created Ubuntu Server VM for the first time: the everyday basic commands you'll use throughout every hands-on article on this blog, the quirks of a US keyboard layout, and finally, checking and enabling the SSH server. Opening the door to SSH here is what let every article after this one continue the work remotely.

Then came the initial setup of a Windows Server instance, built on that same Proxmox VE host. Basic settings — computer name, network, time zone — all handled through nothing but the GUI, finishing with enabling OpenSSH so Windows Server, just like the Linux server before it, could be reached from an SSH client. What looked like the long way around, clicking through GUI screens, was actually what unlocked efficient command-line work later on.

From there we covered Teraterm, the terminal client used to actually make those SSH connections: setting up a new connection, fixing garbled character display, saving connection settings, and recording logs. Each of these small, unglamorous settings turns out to pay off later — the kind of thing where, deep into some future hands-on lab, you're quietly grateful you configured it properly the first time.

Finally came Wireshark: the full workflow of capturing packets on a remote Linux server, transferring that capture back to your own machine, and opening it in Wireshark to actually analyze it. What's really happening in a communication doesn't show up in command-line output alone. Only by looking directly at the packets themselves can you confirm that the theory actually matches what's really happening on the wire.

Looking back across all five articles, a consistent stance runs through this prep series. Creating a VM, logging in for the first time, setting up Windows Server, learning a terminal client, learning a packet-analysis tool — each one looks like a minor, unglamorous chore on its own. But only once all of them are in place does "actually getting hands-on and verifying it yourself" become possible in any of the other hands-on articles. Never brushing off the tools themselves, and patiently learning each one properly — that's a foundation a top-1% engineer takes for granted. And that's the recap of the Hands-On Prep series, complete.
