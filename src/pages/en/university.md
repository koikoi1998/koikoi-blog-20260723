---
layout: ../../layouts/MarkdownPageLayout.astro
title: "The Top 1% University — A Faculty/Department/Grade Roadmap From Complete Beginner to Top Engineer"
description: "The Top 1% Series, reorganized around the metaphor of a university's faculties, departments, and grades. A department-by-department curriculum that gives a clear view all the way from complete beginner to an AWS/Google-caliber top engineer."
lang: "en"
altHref: "/university"
---

## About This Page

The [sitemap](/en/sitemap) is organized as a "STEP1 through STEP8" roadmap that assumes you'll eventually read every article, but as the article count keeps growing, that alone has started to make "what do I actually need right now" harder to see. This page reorganizes the articles and hands-on labs instead, around the university metaphor of **faculty, department, and grade.**

- **Faculty**: The broad category — which direction of engineer you're aiming to become.
- **Department**: A specialized area within a faculty. One department corresponds almost exactly to one of the existing "series."
- **Grade**: The difficulty level of the articles and hands-on labs themselves. From general education through graduate school and beyond, it shows the distance from complete beginner to top engineer, as a sequence of stages.

**At the moment, only the [Active Directory Department](#active-directory-department) is a "fully open" department, satisfying every grade level.** Other departments will fill in their grades gradually, as content gets added over time. No existing article folder or URL has been changed — this page is purely an additional front door, changing how things are presented.

## The Shared Grade Ladder

Every department uses this same set of grade labels.

| Grade | Corresponding Level | Goal |
|---|---|---|
| General Education | Cross-series prerequisite knowledge | You're not lost no matter which department you move into next |
| Freshman | Fundamentals (concepts) + Foundational hands-on (build along as you learn) | You can build it yourself, given a guide |
| Sophomore | Supplementary deep-dive articles | You can explain "why it's designed this way," from internals |
| Junior | Real-world-scenario hands-on | You can handle, on your own, situations that come up constantly in real jobs |
| Senior (Graduation) | Niche-spec hands-on | You can precisely explain fine-grained specs and features, and troubleshoot them |
| Graduate School | Security-hardening hands-on (attacker's perspective) | You understand an attacker's perspective well enough to design defenses |
| Architect | (To be built) | You can design a whole system spanning multiple departments |
| Principal Architect | (To be built) | You can set the design direction itself, across organizations and projects |
| Fellow | (To be built) | You can shape the direction of the technology itself |

**Through graduate school, most departments pair a "lecture article" (theory) with a "hands-on" (practice) at each grade.** From Architect onward, the content is expected to span multiple departments rather than living inside just one, so no articles exist there yet.

## The Full Faculty/Department Picture (Roadmap)

Regardless of how much content currently exists, here's the full list of faculties and departments we ultimately want to build. Any department whose status isn't "fully open" is a target for future article additions.

### Server Engineering Faculty

| Department | Corresponding Series | Status |
|---|---|---|
| Active Directory Department | [active-directory](/en/sitemap#series-list) | 🎓 Fully open (through graduate school) |
| DNS Infrastructure Department | [dns](/en/sitemap#series-list) / [dns-server](/en/sitemap#series-list) | 📖 General education–Freshman level |
| Mail Infrastructure Department | [messaging](/en/sitemap#series-list) | 📖 General education–Freshman level |
| Linux Infrastructure Department | [linux](/en/sitemap#series-list) | 📖 General education level (close to a shared foundational subject across departments) |
| Windows Server Department | [windows-server](/en/sitemap#series-list) | 📖 General education–Freshman level |
| Storage Department | [storage](/en/sitemap#series-list) | 🌱 Few articles |

### Network Engineering Faculty

| Department | Corresponding Series | Status |
|---|---|---|
| VPN Department | [vpn](/en/sitemap#series-list) / [modern-vpn](/en/sitemap#series-list) / [site-to-site-vpn](/en/sitemap#series-list) | 📖 General education–Freshman level |
| Web Proxy/Caching Department | [web-proxy](/en/sitemap#series-list) | 🌱 Few articles (through Freshman hands-on) |
| Load Balancing Department | (not started) | ⬜ Not started |

### Cloud Engineering Faculty

| Department | Corresponding Series | Status |
|---|---|---|
| AWS Department | [aws-basics](/en/sitemap#series-list) | 📗 Open through all 4 hands-on tiers (theory content is general-education level only) |
| Ansible/IaC Department | [ansible](/en/sitemap#series-list) | 📗 Open through all 4 hands-on tiers (theory content is general-education level only) |

### Web/API Engineering Faculty

| Department | Corresponding Series | Status |
|---|---|---|
| Web/API Department | [api](/en/sitemap#series-list) | 🌱 Few articles |

**Legend**: 🎓 Open through graduate school / 📗 Open through all 4 hands-on tiers (theory is thin) / 📖 General education–Freshman level / 🌱 Few articles / ⬜ Not started

## Active Directory Department

The only department, at the moment, that satisfies every grade level. **The goal is that anyone who works through and understands this entire department's curriculum on their own comes away able to handle any real-world job related to AD.**

### General Education (Prerequisite)

- [Understanding How DNS Works From a "Top 1%" Perspective](/en/articles/dns-guide) — The fundamentals of name resolution, a prerequisite underlying this entire series.

### Freshman: Fundamentals + Your First Hands-On

**Lectures (Fundamentals, 10 articles)**

1. [Understanding the Difference Between AD and DC, and Domains vs. Forests, from a "Top 1%" Perspective](/en/articles/ad-dc-fundamentals-guide)
2. [What's the Difference Between sysdm.cpl and netdom computername?](/en/articles/ad-computername-netdom-guide)
3. [Understanding Windows Login and User Profiles from a "Top 1%" Perspective](/en/articles/ad-windows-login-guide)
4. [Why Is AD's DNS Designed This Way?](/en/articles/ad-dns-guide)
5. [Understanding How to Read DNS Zones and Records from a "Top 1%" Perspective](/en/articles/dns-zones-records-guide)
6. [Understanding What FSMO (Operations Master) Is from a "Top 1%" Perspective](/en/articles/fsmo-guide)
7. [Understanding DC Health Checks from a "Top 1%" Perspective](/en/articles/dc-health-check-guide)
8. [Understanding AD "Sites" and Replication Topology from a "Top 1%" Perspective](/en/articles/ad-sites-guide)
9. [Understanding How to Read dcdiag /v from a "Top 1%" Perspective](/en/articles/dcdiag-guide)
10. [Understanding Post-Migration AD Cleanup from a "Top 1%" Perspective](/en/articles/ad-migration-cleanup-guide)

**Hands-On (Foundational Tier, 2 articles)**

1. [The Top 1% Hands-On for Building a Multi-Domain, Multi-Tree AD Forest](/en/articles/ad-multidomain-handson-guide)
2. [The Top 1% Hands-On for Migrating (Replacing) an Old DC With a New One](/en/articles/ad-migration-handson-guide)

### Sophomore: Supplementary Deep-Dives

1. [Understanding How SPNs (Service Principal Names) Work from a "Top 1%" Perspective](/en/articles/ad-spn-guide)
2. [Understanding the Netlogon Service and Secure Channel from a "Top 1%" Perspective](/en/articles/ad-netlogon-guide)
3. [Understanding How Kerberos Authentication Works from a "Top 1%" Perspective](/en/articles/ad-kerberos-guide)
4. [Understanding SYSVOL, DFSR, and Group Policy from a "Top 1%" Perspective](/en/articles/ad-sysvol-dfsr-gpo-guide)
5. [Understanding AD DS, AD CS, AD FS, AD LDS, and AD RMS from a Top-1% Perspective](/en/articles/ad-family-overview-guide)
6. [Understanding the LDAP Protocol from a "Top 1%" Perspective](/en/articles/ad-ldap-protocol-guide)
7. [Why Do NetBIOS Names and DNS Hostnames Coexist?](/en/articles/ad-netbios-dns-history-guide)
8. [Understanding AD Schema Extension from a "Top 1%" Perspective](/en/articles/ad-schema-extension-guide)
9. [Understanding the Relationship Between .NET Framework and PowerShell from a "Top 1%" Perspective](/en/articles/ad-dotnet-powershell-guide)
10. [Understanding What an ISP (Internet Service Provider) Is from a "Top 1%" Perspective](/en/articles/ad-isp-guide)

### Junior: Real-World-Scenario Hands-On

1. [The Top 1% Hands-On for Building a Forest Trust Between Two Independent Forests, Simulating an Acquisition](/en/articles/ad-forest-trust-handson-guide)
2. [The Top 1% Hands-On for Restoring an Accidentally Deleted User or OU With the AD Recycle Bin](/en/articles/ad-recycle-bin-handson-guide)
3. [The Top 1% Hands-On for Actually Creating and Linking GPOs, and Experiencing Priority and Troubleshooting](/en/articles/ad-gpo-handson-guide)
4. [The Top 1% Hands-On for Applying Different Password Requirements Per Department With Fine-Grained Password Policy (PSO)](/en/articles/ad-fgpp-handson-guide)
5. [The Top 1% Hands-On for Delegating OU Control: Giving the Help Desk Password-Reset Rights Only](/en/articles/ad-delegation-handson-guide)
6. [The Top 1% Hands-On for Solving the "Double-Hop Problem" With Kerberos Constrained Delegation](/en/articles/ad-constrained-delegation-handson-guide)
7. [The Top 1% Hands-On for System State Backup and Authoritative Restore](/en/articles/ad-backup-restore-handson-guide)
8. [The Top 1% Hands-On for Seizing FSMO Roles, Simulating a Completely Lost Old DC](/en/articles/ad-fsmo-seize-handson-guide)

### Senior (Graduation): Niche-Spec Hands-On

1. [The Top 1% Hands-On for Escaping Password Management With gMSA (Group Managed Service Accounts)](/en/articles/ad-gmsa-handson-guide)
2. [The Top 1% Hands-On for Building an Enterprise CA With AD CS and Experiencing Automatic Certificate Enrollment](/en/articles/ad-cs-handson-guide)
3. [The Top 1% Hands-On for Building an RODC (Read-Only Domain Controller) for a Branch Office Deployment](/en/articles/ad-rodc-handson-guide)
4. [The Top 1% Hands-On for Raising Domain/Forest Functional Levels](/en/articles/ad-functional-level-handson-guide)
5. [The Top 1% Hands-On for Configuring AD-Integrated DNS Scavenging (Automatic Deletion of Stale Records)](/en/articles/ad-dns-scavenging-handson-guide)
6. [The Top 1% Hands-On for Controlling Replication Paths With Site Link Cost](/en/articles/ad-sitelink-topology-handson-guide)

**Work through and understand all 6 of these, and you're at graduation level, as a "Senior."**

### Graduate School: Security-Hardening Hands-On (An Attacker's Perspective)

1. [The Top 1% Hands-On for Reproducing Kerberoasting Yourself and Protecting Service Accounts](/en/articles/ad-kerberoasting-handson-guide)
2. [The Top 1% Hands-On for Auditing the Replication Rights DCSync Abuses, and Defending With the Tier 0 Model](/en/articles/ad-dcsync-audit-handson-guide)

Both are educational, defense-focused hands-on labs, meant to strengthen the defenses of a test environment you manage yourself.

### Architect and Beyond

No articles exist here yet. This is expected to cover organization-wide directory-service design spanning multiple departments — not just AD, but certificate infrastructure, monitoring, and more. Work on this will start once other departments have grown enough.

### Audio Learning Materials (Regardless of Grade)

- [[Audio Lecture] Active Directory, Parts 1-4](/en/articles/ad-audio-lecture-1-guide) (all 4 parts — learn from zero, by ear alone, without reading a single article)
- [[Listen] The Active Directory Series, Fully Recapped](/en/articles/ad-audio-review-guide) (for reviewing after graduation)

## What's Next

- A **capstone hands-on (a graduation project)** combining content across multiple grades is planned as each department's graduation requirement.
- We're considering a format — like a GitHub repository of the finished work — that lets you use the result as a job-hunting portfolio.
- For departments beyond Active Directory too, we'll keep extending things in the spirit of the university metaphor — for example, positioning the existing quiz feature as a "graduation exam."
