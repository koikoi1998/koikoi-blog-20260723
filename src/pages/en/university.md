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

**At the moment, the [Active Directory Department](#active-directory-department), the [AWS Department](#aws-department), the [Ansible/IaC Department](#ansibleiac-department), the [VPN Department](#vpn-department), the [DNS Infrastructure Department](#dns-infrastructure-department), the [Mail Infrastructure Department](#mail-infrastructure-department), the [Windows Server Department](#windows-server-department), the [Load Balancing Department](#load-balancing-department), the [Web/API Department](#webapi-department), the [Storage Department](#storage-department), the [Linux Infrastructure Department](#linux-infrastructure-department), and the [Web Proxy/Caching Department](#web-proxycaching-department) are "fully open" departments, satisfying every grade level.** Other departments will fill in their grades gradually, as content gets added over time. No existing article folder or URL has been changed — this page is purely an additional front door, changing how things are presented.

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

## About the Graduation Exam

Every department's articles each have a [quiz](/quiz) already attached. This isn't a new feature — it's the quiz that's existed on this site all along, simply repositioned as a "graduation exam" to fit the university metaphor. Use the [quiz](/quiz)'s per-topic mode to pick that department's articles and take them on. Whether you can answer the questions for its Senior and Graduate School articles on your own — or, if the department isn't "fully open" yet, its current highest grade's articles — is a good measure of whether you've graduated (or completed that grade). If you miss a question, go back and review the article it's tied to.

## The Full Faculty/Department Picture (Roadmap)

Regardless of how much content currently exists, here's the full list of faculties and departments we ultimately want to build. Any department whose status isn't "fully open" is a target for future article additions.

### Server Engineering Faculty

| Department | Corresponding Series | Status |
|---|---|---|
| Active Directory Department | [active-directory](/en/sitemap#series-list) | 🎓 Fully open (through graduate school) |
| DNS Infrastructure Department | [dns](/en/sitemap#series-list) | 🎓 Fully open (through graduate school) |
| Mail Infrastructure Department | [messaging](/en/sitemap#series-list) | 🎓 Fully open (through graduate school) |
| Linux Infrastructure Department | [linux](/en/sitemap#series-list) | 🎓 Fully open through grad school |
| Windows Server Department | [windows-server](/en/sitemap#series-list) | 🎓 Fully open (through graduate school) |
| Storage Department | [storage](/en/sitemap#series-list) | 🎓 Fully open through grad school |

### Network Engineering Faculty

| Department | Corresponding Series | Status |
|---|---|---|
| VPN Department | [vpn](/en/sitemap#series-list) / [modern-vpn](/en/sitemap#series-list) / [site-to-site-vpn](/en/sitemap#series-list) | 🎓 Fully open (through graduate school) |
| Web Proxy/Caching Department | [web-proxy](/en/sitemap#series-list) | 🎓 Fully open through grad school |
| Load Balancing Department | [load-balancing](/en/sitemap#series-list) | 🎓 Fully open (through graduate school) |

### Cloud Engineering Faculty

| Department | Corresponding Series | Status |
|---|---|---|
| AWS Department | [aws-basics](/en/sitemap#series-list) | 🎓 Fully open (through graduate school) |
| Ansible/IaC Department | [ansible](/en/sitemap#series-list) | 🎓 Fully open (through graduate school) |

### Web/API Engineering Faculty

| Department | Corresponding Series | Status |
|---|---|---|
| Web/API Department | [api](/en/sitemap#series-list) | 🎓 Fully open (through graduate school) |

**Legend**: 🎓 Open through graduate school / 📗 Open through all 4 hands-on tiers (theory is thin) / 📙 Reached Junior level / 📖 General education–Freshman level / 🌱 Few articles / ⬜ Not started

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
4. [Understanding How NTLM Authentication Works From a Top 1% Perspective](/en/articles/ad-ntlm-mechanism-guide)
5. [Understanding IAKerb and LocalKDC From a Top 1% Perspective](/en/articles/ad-iakerb-localkdc-guide)
6. [Understanding AES128, AES256, and SHA-1's Role in Kerberos From a Top 1% Perspective](/en/articles/ad-kerberos-encryption-types-guide)
7. [Understanding RDP Authentication Changes Since Windows 11 24H2/Windows Server 2025 From a Top 1% Perspective](/en/articles/ad-rdp-auth-changes-guide)
8. [Understanding SYSVOL, DFSR, and Group Policy from a "Top 1%" Perspective](/en/articles/ad-sysvol-dfsr-gpo-guide)
9. [Understanding AD DS, AD CS, AD FS, AD LDS, and AD RMS from a Top-1% Perspective](/en/articles/ad-family-overview-guide)
10. [Understanding the LDAP Protocol from a "Top 1%" Perspective](/en/articles/ad-ldap-protocol-guide)
11. [Why Do NetBIOS Names and DNS Hostnames Coexist?](/en/articles/ad-netbios-dns-history-guide)
12. [Understanding AD Schema Extension from a "Top 1%" Perspective](/en/articles/ad-schema-extension-guide)
13. [Understanding the Relationship Between .NET Framework and PowerShell from a "Top 1%" Perspective](/en/articles/ad-dotnet-powershell-guide)
14. [Understanding What an ISP (Internet Service Provider) Is from a "Top 1%" Perspective](/en/articles/ad-isp-guide)

### Junior: Real-World-Scenario Hands-On

1. [The Top 1% Hands-On for Building a Forest Trust Between Two Independent Forests, Simulating an Acquisition](/en/articles/ad-forest-trust-handson-guide)
2. [The Top 1% Hands-On for Restoring an Accidentally Deleted User or OU With the AD Recycle Bin](/en/articles/ad-recycle-bin-handson-guide)
3. [The Top 1% Hands-On for Actually Creating and Linking GPOs, and Experiencing Priority and Troubleshooting](/en/articles/ad-gpo-handson-guide)
4. [The Top 1% Hands-On for Applying Different Password Requirements Per Department With Fine-Grained Password Policy (PSO)](/en/articles/ad-fgpp-handson-guide)
5. [The Top 1% Hands-On for Delegating OU Control: Giving the Help Desk Password-Reset Rights Only](/en/articles/ad-delegation-handson-guide)
6. [The Top 1% Hands-On for Solving the "Double-Hop Problem" With Kerberos Constrained Delegation](/en/articles/ad-constrained-delegation-handson-guide)
7. [The Top 1% Hands-On for System State Backup and Authoritative Restore](/en/articles/ad-backup-restore-handson-guide)
8. [The Top 1% Hands-On for Seizing FSMO Roles, Simulating a Completely Lost Old DC](/en/articles/ad-fsmo-seize-handson-guide)
9. [[Incident Investigation] A Top 1% Hands-On for Investigating, From the Error Itself, Why You Can't Log In as Administrator After Promoting a New DC](/en/articles/ad-dc-replace-ntlm-lockout-investigation-guide)
10. [A Top 1% Hands-On for Auditing and Refreshing Privileged Account Passwords Before a DC Replacement](/en/articles/ad-privileged-password-refresh-handson-guide)

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
3. [A Top 1% Hands-On for Reproducing Unconstrained Delegation's Danger Yourself and Confirming Defense via 'Account Is Sensitive and Cannot Be Delegated'](/en/articles/ad-unconstrained-delegation-handson-guide)

All three are educational, defense-focused hands-on labs, meant to strengthen the defenses of a test environment you manage yourself.

### Capstone Project

1. [The Active Directory Department's Capstone Project: Turning an Acquisition-Integration Scenario Into a Portfolio Piece](/en/articles/ad-capstone-handson-guide)

An integrative exercise where you combine, on your own, the techniques learned individually in earlier hands-on labs (forest trust, GPO, delegation, gMSA, backup, Kerberoasting/DCSync auditing) into a single fictional corporate acquisition scenario. It calls for the ability to design from requirements, not just follow steps, and the deliverable is assembled as a portfolio piece usable in a job search.

### Architect and Beyond

No articles exist here yet. This is expected to cover organization-wide directory-service design spanning multiple departments — not just AD, but certificate infrastructure, monitoring, and more. Work on this will start once other departments have grown enough.

### Audio Learning Materials (Regardless of Grade)

- [[Audio Lecture] Active Directory, Parts 1-4](/en/articles/ad-audio-lecture-1-guide) (all 4 parts — learn from zero, by ear alone, without reading a single article)
- [[Listen] The Active Directory Series, Fully Recapped](/en/articles/ad-audio-review-guide) (for reviewing after graduation)

## AWS Department

Following the Active Directory Department, this is the second department to satisfy every grade level. **The goal is that anyone who works through and understands this entire department's curriculum on their own comes away able to handle building, operating, and securing systems on AWS end to end, on their own.**

### General Education (Prerequisite)

- [Hands-On Prep Manual: Basic Operation of the AWS Management Console](/en/articles/aws-console-setup-guide) — If you're not comfortable navigating the Management Console yet, read this first so you're never lost during the hands-on labs that follow.

### Freshman: Fundamentals + Your First Hands-On

**Lectures (Fundamentals, 4 articles)**

1. [Understanding EC2 Key Pairs and Reserved Subnet IPs from a "Top 1%" Perspective](/en/articles/aws-ec2-networking-basics-guide)
2. [Understanding AWS Regions, Availability Zones, and Edge Locations From a "Top 1%" Perspective](/en/articles/aws-global-infrastructure-guide)
3. [Understanding EC2 Pricing Models (On-Demand, Reserved, Spot) From a "Top 1%" Perspective](/en/articles/aws-ec2-pricing-models-guide)
4. [Understanding AWS's Shared Responsibility Model From a "Top 1%" Perspective](/en/articles/aws-shared-responsibility-model-guide)

**Hands-On (Foundational Tier, 1 article)**

1. [The Top 1% Hands-On for Launching an EC2 Instance and Publishing a Web Server](/en/articles/aws-ec2-webserver-handson-guide)

### Sophomore: Supplementary Deep-Dives

1. [Understanding IAM Policy Evaluation Logic From a "Top 1%" Perspective](/en/articles/aws-iam-policy-evaluation-guide)
2. [Understanding S3 Storage Classes and Lifecycle Policies From a "Top 1%" Perspective](/en/articles/aws-s3-storage-classes-guide)
3. [Understanding the Difference Between Security Groups and Network ACLs (NACLs) From a "Top 1%" Perspective](/en/articles/aws-nacl-security-group-guide)

### Junior: Real-World-Scenario Hands-On

1. [The Top 1% Hands-On for Never Giving EC2 an Access Key: Escaping Hardcoded Credentials With an IAM Role](/en/articles/aws-iam-role-handson-guide)
2. [The Top 1% Hands-On for Publishing a Static Website From an S3 Bucket](/en/articles/aws-s3-static-website-handson-guide)
3. [The Top 1% Hands-On for Building a VPC With Public/Private Subnets Yourself](/en/articles/aws-vpc-handson-guide)
4. [The Top 1% Hands-On for Never Letting an App Write a Password With RDS and Secrets Manager](/en/articles/aws-rds-secrets-handson-guide)

### Senior (Graduation): Niche-Spec Hands-On

1. [The Top 1% Hands-On for Reaching S3 Without a NAT Gateway Using a VPC Endpoint](/en/articles/aws-vpc-endpoint-handson-guide)
2. [The Top 1% Hands-On for Building a Backup/Restore Strategy With EBS Snapshots and AMIs](/en/articles/aws-ebs-snapshot-handson-guide)

**Work through and understand both of these, and you're at graduation level, as a "Senior."**

### Graduate School: Security-Hardening Hands-On (An Attacker's Perspective)

1. [The Top 1% Hands-On for Reproducing the Danger of an Overly Broad IAM Policy and Scoping It to Least Privilege](/en/articles/aws-least-privilege-policy-handson-guide)
2. [The Top 1% Hands-On for Detecting a Leaked Access Key's Misuse With CloudTrail and GuardDuty](/en/articles/aws-cloudtrail-guardduty-handson-guide)

Both are educational, defense-focused hands-on labs, meant to strengthen the defenses of a test environment you manage yourself.

### Capstone Project

1. [The AWS Department's Capstone Project: Turning a Fictional E-Commerce Site's Infrastructure Into a Portfolio Piece](/en/articles/aws-capstone-handson-guide)

An integrative exercise where you combine, on your own, the techniques learned individually in earlier hands-on labs (VPC design, EC2, RDS/Secrets Manager, S3, IAM roles, VPC endpoints, EBS backups, least-privilege policies, CloudTrail/GuardDuty) into a single fictional e-commerce migration scenario. It calls for the ability to design from requirements, not just follow steps, and the deliverable is assembled as a portfolio piece usable in a job search.

### Architect and Beyond

No articles exist here yet. This is expected to cover system-wide architecture design spanning multiple departments — not just AWS, but Ansible/IaC and network design too.

### Audio Learning Materials (Regardless of Grade)

- [[Listen] The AWS Fundamentals Series, Fully Recapped](/en/articles/aws-basics-audio-review-guide) (for reviewing after graduation)

## Ansible/IaC Department

Following the AWS Department, this is the third department to become "fully open." **The goal is that anyone who works through and understands this entire department's curriculum on their own comes away able to run real-world-grade Ansible configuration management on their own, with an eye toward operating it as a team.**

### General Education (Prerequisite)

- [Hands-On Prep Manual: Setting Up an Ubuntu Server for the First Time](/en/articles/ubuntu-server-setup-guide) — The basics of the SSH connection Ansible is built on top of.

### Freshman: Fundamentals + Your First Hands-On

**Lectures (Fundamentals, 4 articles)**

1. [Understanding What Ansible Actually Is From a "Top 1%" Perspective](/en/articles/ansible-guide)
2. [Understanding ansible.cfg and Setting Precedence From a "Top 1%" Perspective](/en/articles/ansible-cfg-guide)
3. [Understanding Ansible Variable Precedence From a "Top 1%" Perspective](/en/articles/ansible-variable-precedence-guide)
4. [Understanding Ansible's Check Mode and Diff Mode From a "Top 1%" Perspective](/en/articles/ansible-check-diff-mode-guide)

**Hands-On (Foundational Tier, 1 article)**

1. [A "Top 1%" Hands-On Lab: Automating Configuration Across Multiple Servers with Ansible](/en/articles/ansible-handson-guide)

### Sophomore: Supplementary Deep-Dives

1. [Understanding Ansible's Execution Strategy and Fork Parallelism From a "Top 1%" Perspective](/en/articles/ansible-execution-strategy-guide)
2. [Understanding Ansible's ignore_errors, any_errors_fatal, and failed_when From a "Top 1%" Perspective](/en/articles/ansible-error-handling-strategies-guide)
3. [Understanding Ansible Tower/AWX From a "Top 1%" Perspective](/en/articles/ansible-tower-awx-overview-guide)

### Junior: Real-World-Scenario Hands-On

1. [The Top 1% Hands-On for Real-World Config Management With Ansible Roles, Handlers, and Templates](/en/articles/ansible-roles-handson-guide)
2. [The Top 1% Hands-On for Never Leaving a Password in Plaintext in Git With Ansible Vault](/en/articles/ansible-vault-handson-guide)
3. [The Top 1% Hands-On for Escaping the Static IP List With Ansible's AWS Dynamic Inventory](/en/articles/ansible-aws-dynamic-inventory-handson-guide)
4. [The Top 1% Hands-On for Safely Running dev/staging/prod From One Ansible Playbook](/en/articles/ansible-environments-handson-guide)
5. [The Top 1% Hands-On for Using Community Roles and Collections With Ansible Galaxy](/en/articles/ansible-galaxy-collections-handson-guide)

### Senior (Graduation): Niche-Spec Hands-On

1. [The Top 1% Hands-On for Experiencing Ansible's Jinja2 Filters and the loop/when Gotchas](/en/articles/ansible-jinja2-loops-handson-guide)
2. [The Top 1% Hands-On for Speeding Up a Large Inventory by Caching Ansible Facts](/en/articles/ansible-facts-caching-handson-guide)
3. [The Top 1% Hands-On for Designing a Rollback on Failed Configuration Changes With Ansible's block/rescue/always](/en/articles/ansible-error-handling-handson-guide)

**Work through and understand all 3 of these, and you're at graduation level, as a "Senior."**

### Graduate School: Security-Hardening Hands-On (An Attacker's Perspective)

1. [The Top 1% Hands-On for Closing Off the Paths Where Secrets Leak Into Logs and Process Lists During an Ansible Run](/en/articles/ansible-secrets-exposure-handson-guide)

An educational, defense-focused hands-on lab, meant to strengthen the defenses of a test environment you manage yourself.

### Capstone Project

1. [The Ansible/IaC Department's Capstone Project: Turning a Fictional Startup's Configuration Management Platform Into a Portfolio Piece](/en/articles/ansible-capstone-handson-guide)

An integrative exercise where you combine, on your own, the techniques learned individually in earlier hands-on labs (roles/Handlers/templates, Vault, AWS dynamic inventory, environment separation, Galaxy, error handling, secrets protection) into a single fictional startup's configuration management platform. It calls for the ability to design from requirements, not just follow steps, and the deliverable is assembled as a portfolio piece usable in a job search.

### Architect and Beyond

No articles exist here yet. As with the AWS Department, this is expected to cover system-wide architecture design spanning multiple departments.

### Audio Learning Materials (Regardless of Grade)

- [[Listen] The Ansible Series, Fully Recapped](/en/articles/ansible-audio-review-guide) (for reviewing after graduation)

## VPN Department

The fourth department to become "fully open," following Active Directory, AWS, and Ansible/IaC. **This department differs from the other "fully open" departments in that it's built across three existing series: [vpn](/en/sitemap#series-list), [modern-vpn](/en/sitemap#series-list), and [site-to-site-vpn](/en/sitemap#series-list).** The goal is that anyone who works through and understands this entire department's curriculum on their own comes away able to handle remote-access VPN, modern VPN protocols, and site-to-site VPN alike — end to end, from design through building, troubleshooting, and security hardening.

### General Education (Prerequisite)

- [Understanding How NAT/NAPT Works From a "Top 1%" Perspective](/en/articles/nat-guide) — A prerequisite for understanding IPsec's NAT traversal (NAT-T).

### Freshman: Fundamentals + Your First Hands-On

**Lectures (Fundamentals, 3 articles)**

1. [Understanding How L2TP/IPsec Works From a "Top 1%" Perspective](/en/articles/l2tp-ipsec-guide)
2. [Why Does a VPN Client Need a Gateway on the Same Subnet?](/en/articles/windows-server-l2tp-vpn-guide)
3. [Comparing L2TP/IPsec to Modern VPN Protocols From a "Top 1%" Perspective](/en/articles/vpn-protocols-comparison-guide)

**Hands-On (Foundational Tier, 1 article)**

1. [A "Top 1%" Hands-On Lab: Building Your Own L2TP/IPsec Server and Verifying the Theory Yourself](/en/articles/l2tp-ipsec-lab-guide)

### Sophomore: Supplementary Deep-Dives

1. [Understanding IPsec's AH (Authentication Header) From a "Top 1%" Perspective](/en/articles/ipsec-ah-guide)
2. [Understanding the Differences Between VPN Access, Dial-Up Access, Demand-Dial Access, NAT, and LAN Routing in Windows Server RRAS From a "Top 1%" Perspective](/en/articles/windows-rras-roles-guide)
3. [How OpenVPN Works Internally From a "Top 1%" Perspective](/en/articles/openvpn-internals-guide)
4. [How WireGuard Works Internally From a "Top 1%" Perspective](/en/articles/wireguard-internals-guide)
5. [How Tailscale Works From a "Top 1%" Perspective](/en/articles/tailscale-internals-guide)
6. [What Is ZTNA (Zero Trust Network Access) From a "Top 1%" Perspective](/en/articles/ztna-guide)

### Junior: Real-World-Scenario Hands-On

1. [L2TP/IPsec Troubleshooting Lab](/en/articles/l2tp-ipsec-troubleshooting-lab)
2. [The Top 1% Hands-On for Building a WireGuard Tunnel Yourself and Feeling Cryptokey Routing in Action](/en/articles/wireguard-handson-guide)

### Senior (Graduation): Niche-Spec

**Lectures (3 articles)**

1. [Understanding Site-to-Site VPN From a "Top 1%" Perspective](/en/articles/site-to-site-vpn-guide)
2. [Understanding Site-to-Site VPN With AWS From a "Top 1%" Perspective](/en/articles/site-to-site-vpn-aws-guide)
3. [Understanding SD-WAN and Edge Router Selection From a "Top 1%" Perspective](/en/articles/sdwan-edge-router-guide)

**Hands-On (1 article)**

1. [The Top 1% Hands-On for Mock-Building a Cross-Vendor Site-to-Site IPsec Tunnel With strongSwan](/en/articles/site-to-site-vpn-handson-guide)

**Work through and understand all 4 of these, and you're at graduation level, as a "Senior."**

### Graduate School: Security-Hardening Hands-On (An Attacker's Perspective)

1. [The Top 1% Hands-On for Reproducing an Offline Dictionary Attack Against IKE Aggressive Mode and PSK, and Defending With a Move to IKEv2](/en/articles/ike-psk-cracking-handson-guide)

An educational, defense-focused hands-on lab, meant to strengthen the defenses of a test environment you manage yourself.

### Capstone Project

1. [The VPN Department's Capstone Project: Turning a Fictional Multi-Site Company's VPN Infrastructure Into a Portfolio Piece](/en/articles/vpn-capstone-handson-guide)

An integrative exercise where you combine, on your own, the techniques learned individually in earlier hands-on labs (Site-to-Site VPN, WireGuard, L2TP/IPsec, PSK hardening via IKEv2, troubleshooting) into a single fictional multi-site company's VPN infrastructure. It calls for the ability to design from requirements, not just follow steps, and the deliverable is assembled as a portfolio piece usable in a job search.

### Architect and Beyond

No articles exist here yet. As with the other departments, this is expected to cover system-wide architecture design spanning multiple departments.

### Audio Learning Materials (Regardless of Grade)

- [[Listen] The Remote-Access VPN / L2TP-IPsec Series, Fully Recapped](/en/articles/vpn-audio-review-guide) (for reviewing after graduation)
- [[Listen] The Modern VPN Protocol Deep-Dive Series, Fully Recapped](/en/articles/modern-vpn-audio-review-guide) (for reviewing after graduation)
- [[Listen] The Site-to-Site VPN Series, Fully Recapped](/en/articles/site-to-site-vpn-audio-review-guide) (for reviewing after graduation)

## Load Balancing Department

A newly launched department, started from zero articles, now the 8th department to reach "fully open," following Active Directory, AWS, Ansible/IaC, VPN, DNS, Mail, and Windows Server. Its corresponding series is [load-balancing](/en/sitemap#series-list). Working through this department's full curriculum yourself aims to get you to a real-world level of judgment on the L4/L7 load balancer distinction, routing algorithm and health check design, TLS certificate placement (termination, passthrough, or bridging), making the load balancer itself redundant, GSLB-based global distribution, and niche-spec and security weaknesses like DSR and HTTP request smuggling.

### General Education (Prerequisites)

None.

### Freshman: Fundamentals + Your First Hands-On

**Lecture (fundamentals, 3 articles)**

1. [Understanding the Difference Between L4 and L7 Load Balancers From a Top 1% Perspective](/en/articles/load-balancing-fundamentals-guide)
2. [Understanding Load Balancing Algorithms and Health Checks From a Top 1% Perspective](/en/articles/load-balancing-algorithms-guide)
3. [Understanding SSL Termination vs. SSL Passthrough From a Top 1% Perspective](/en/articles/load-balancing-ssl-termination-guide)

**Hands-On (fundamentals, 1 article)**

1. [A Top 1% Hands-On for Building an L7 Load Balancer With HAProxy and Distributing Traffic Across Multiple Backend Servers](/en/articles/load-balancing-haproxy-handson-guide)

**Work through and understand these four, and you're at a solid checkpoint as a "Freshman."**

### Sophomore: Supplementary Deep-Dives

1. [Understanding GSLB (Global Server Load Balancing) From a Top 1% Perspective](/en/articles/load-balancing-gslb-guide)
2. [Understanding Load Balancer Redundancy Itself From a Top 1% Perspective](/en/articles/load-balancing-vrrp-keepalived-guide)
3. [Understanding the PROXY Protocol From a Top 1% Perspective](/en/articles/load-balancing-proxy-protocol-guide)

### Junior: Real-World-Scenario Hands-On

1. [A Top 1% Hands-On for Making Two HAProxy Servers Redundant With keepalived and Experiencing Automatic VIP Failover](/en/articles/load-balancing-keepalived-handson-guide)

### Senior (Graduation): Niche-Spec Hands-On

1. [A Top 1% Hands-On for Building DSR (Direct Server Return) With IPVS and Feeling a Design Where the Response Never Touches the Load Balancer](/en/articles/load-balancing-dsr-handson-guide)

**Work through and understand this one, and you're at graduation level, as a "Senior."**

### Graduate School: Security-Hardening Hands-On (An Attacker's Perspective)

1. [A Top 1% Hands-On for Reproducing HTTP Request Smuggling With Curl and Netcat, and Confirming HAProxy's Strict Parsing Defense](/en/articles/load-balancing-request-smuggling-handson-guide)

An educational, defense-focused hands-on lab, meant to strengthen the defenses of a test environment you manage yourself (it contains no procedure for attacking a third party's system).

### Capstone Project

1. [The Load Balancing Department's Capstone Project: Turning a Fictional Video-Streaming Startup's Traffic-Distribution Infrastructure Into a Portfolio Piece](/en/articles/load-balancing-capstone-handson-guide)

An integrative exercise where you combine, on your own, the techniques learned individually in earlier hands-on labs (GSLB, L7 load balancing with HAProxy, VRRP/keepalived redundancy, TLS certificate placement, DSR, preserving the client's IP via the PROXY protocol, HTTP request smuggling defense) into a single fictional video-streaming startup's traffic-distribution infrastructure. It calls for the ability to design from requirements, not just follow steps, and the deliverable is assembled as a portfolio piece usable in a job search.

### Architect and Beyond

No articles exist here yet. As with the other departments, this is expected to cover system-wide architecture design spanning multiple departments.

### Audio Learning Materials (Regardless of Grade)

- [[Listen] The Load Balancing Fundamentals Series, Fully Recapped](/en/articles/load-balancing-audio-review-guide) (for reviewing after graduation)

## DNS Infrastructure Department

The fifth department to become "fully open," following Active Directory, AWS, Ansible/IaC, and VPN. The goal is that anyone who works through and understands this entire department's curriculum on their own comes away able to handle building and operating a DNS server with BIND, signing/validating with DNSSEC, and defending against delegation issues and DNS amplification, at a real-world level.

### General Education (Prerequisite)

- [Understanding How DNS Works From a "Top 1%" Perspective](/en/articles/dns-guide) — The fundamentals of name resolution, a prerequisite underlying this entire series.

### Freshman: Fundamentals + Your First Hands-On

**Lectures (Fundamentals, 2 articles)**

1. [Understanding DNS Server Fundamentals From a "Top 1%" Perspective](/en/articles/dns-server-fundamentals-guide)
2. [Understanding How to Use dig and nslookup From a "Top 1%" Perspective](/en/articles/dig-nslookup-guide)

**Hands-On (Foundational Tier, 1 article)**

1. [A "Top 1%" Hands-On Lab: Building a DNS Server With BIND and Experiencing a Zone Transfer](/en/articles/dns-server-handson-guide)

### Sophomore: Supplementary Deep-Dives

1. [Understanding How DNSSEC Works From a "Top 1%" Perspective](/en/articles/dns-dnssec-fundamentals-guide)
2. [Understanding Recursive Resolvers, Forwarders, and Negative Caching From a "Top 1%" Perspective](/en/articles/dns-recursive-caching-guide)
3. [Understanding Split-Horizon DNS (BIND's Views) From a "Top 1%" Perspective](/en/articles/dns-split-horizon-guide)
4. [Understanding DNS over HTTPS (DoH) and DNS over TLS (DoT) From a Top 1% Perspective](/en/articles/dns-doh-dot-guide)

### Junior: Real-World-Scenario Hands-On

1. [The Top 1% Hands-On for Signing a BIND Zone With DNSSEC and Reproducing a Validation Failure (SERVFAIL) Yourself](/en/articles/dns-dnssec-handson-guide)

### Senior (Graduation): Niche-Spec Hands-On

1. [The Top 1% Hands-On for Building Subdomain Delegation Yourself and Reproducing Lame Delegation](/en/articles/dns-delegation-handson-guide)

**Work through and understand this one, and you're at graduation level, as a "Senior."**

### Graduate School: Security-Hardening Hands-On (An Attacker's Perspective)

1. [The Top 1% Hands-On for Seeing DNS Amplification Firsthand and Defending With Response Rate Limiting (RRL)](/en/articles/dns-amplification-rrl-handson-guide)

An educational, defense-focused hands-on lab, meant to strengthen the defenses of a test environment you manage yourself (spoofing a source IP address is never covered).

### Capstone Project

1. [The DNS Infrastructure Department's Capstone Project: Turning a Fictional Company's DNS Infrastructure Into a Portfolio Piece](/en/articles/dns-capstone-handson-guide)

An integrative exercise where you combine, on your own, the techniques learned individually in earlier hands-on labs (master/slave zone transfers, split-horizon DNS, subdomain delegation, DNSSEC, DNS amplification defense) into a single fictional company's DNS infrastructure. It calls for the ability to design from requirements, not just follow steps, and the deliverable is assembled as a portfolio piece usable in a job search.

### Architect and Beyond

No articles exist here yet. As with the other departments, this is expected to cover system-wide architecture design spanning multiple departments.

### Audio Learning Materials (Regardless of Grade)

- [[Listen] The DNS Server Fundamentals Series, Fully Recapped](/en/articles/dns-audio-review-guide) (for reviewing after graduation)

## Mail Infrastructure Department

The 6th department to become "fully open," following Active Directory, AWS, Ansible/IaC, VPN, and DNS Infrastructure. The goal is that anyone who works through and understands this entire department's curriculum on their own comes away able to handle building and operating a mail server with Postfix/Dovecot, defending against spoofing with SPF/DKIM, and operating virtual domains and defending against open-relay abuse, at a real-world level.

### General Education (Prerequisite)

None (a basic understanding of DNS is enough).

### Freshman: Fundamentals + Your First Hands-On

**Lectures (Fundamentals, 2 articles)**

1. [Understanding Email Migration to M365 From a "Top 1%" Perspective](/en/articles/m365-email-fundamentals-guide)
2. [Understanding Mail Server Fundamentals From a "Top 1%" Perspective](/en/articles/mail-server-fundamentals-guide)

**Hands-On (Foundational Tier, 1 article)**

1. [A "Top 1%" Hands-On Lab: Building a Mail Server With Postfix and Dovecot](/en/articles/mail-server-handson-guide)

### Sophomore: Supplementary Deep-Dives

1. [Understanding How SPF, DKIM, and DMARC Work From a "Top 1%" Perspective](/en/articles/mail-spf-dkim-dmarc-guide)
2. [Understanding ARC (Authenticated Received Chain) From a Top 1% Perspective](/en/articles/mail-arc-guide)
3. [Understanding Mail Queues and Bounces From a "Top 1%" Perspective](/en/articles/mail-queue-bounce-guide)
4. [Understanding SMTP's STARTTLS From a "Top 1%" Perspective](/en/articles/mail-tls-encryption-guide)

### Junior: Real-World-Scenario Hands-On

1. [The Top 1% Hands-On for Implementing SPF Checking and DKIM Signing on Postfix](/en/articles/mail-spf-dkim-dmarc-handson-guide)

### Senior (Graduation): Niche-Spec Hands-On

1. [The Top 1% Hands-On for Building Virtual Domains to Relay Mail for Multiple Domains on a Single Postfix Server](/en/articles/mail-virtual-domains-handson-guide)

**Work through and understand this one, and you're at graduation level, as a "Senior."**

### Graduate School: Security-Hardening Hands-On (An Attacker's Perspective)

1. [The Top 1% Hands-On for Reproducing an Open Relay Yourself and Defending With Correct Restriction Settings](/en/articles/mail-open-relay-handson-guide)

An educational, defense-focused hands-on lab, meant to strengthen the defenses of a test environment you manage yourself.

### Capstone Project

1. [The Mail Infrastructure Department's Capstone Project: Turning a Fictional Company's Mail Infrastructure Into a Portfolio Piece](/en/articles/mail-capstone-handson-guide)

An integrative exercise where you combine, on your own, the techniques learned individually in earlier hands-on labs (building Postfix/Dovecot, virtual domains, SPF/DKIM/DMARC, STARTTLS, open-relay defense, bounce handling) into a single fictional company's mail infrastructure. It calls for the ability to design from requirements, not just follow steps, and the deliverable is assembled as a portfolio piece usable in a job search.

### Architect and Beyond

No articles exist here yet. As with the other departments, this is expected to cover system-wide architecture design spanning multiple departments.

### Audio Learning Materials (Regardless of Grade)

- [[Listen] The Mail Infrastructure Series, Fully Recapped](/en/articles/mail-audio-review-guide) (for reviewing after graduation)

## Windows Server Department

The 7th department to become "fully open," following Active Directory, AWS, Ansible/IaC, VPN, DNS Infrastructure, and Mail Infrastructure. The goal is that anyone who works through and understands this entire department's curriculum on their own comes away able to handle Windows Server's file/web server operations, centered on IIS, SMB sharing, and DFS, along with security and operational essentials like disabling SMB1 and using SNI, at a real-world level.

### General Education (Prerequisite)

None.

### Freshman: Fundamentals + Your First Hands-On

**Lectures (Fundamentals, 6 articles)**

1. [Understanding Windows Server Licensing (OEM, Datacenter, Standard) From a "Top 1%" Perspective](/en/articles/windows-server-licensing-guide)
2. [Understanding the Configuration Values for Building an NTP Server on Windows Server From a "Top 1%" Perspective](/en/articles/windows-ntp-server-guide)
3. [Understanding How IIS and ASP.NET Work From a "Top 1%" Perspective](/en/articles/iis-fundamentals-guide)
4. [Understanding the Relationship Between IIS and FTP From a "Top 1%" Perspective](/en/articles/iis-ftp-guide)
5. [Understanding Windows Server SMB File Sharing From a "Top 1%" Perspective](/en/articles/smb-file-sharing-guide)
6. [What's the Difference Between SMB and CIFS?](/en/articles/smb-cifs-linux-interop-guide)

**Hands-On (Foundational Tier, 1 article)**

1. [A "Top 1%" Hands-On Lab: Writing Your Own HTTP Server From Scratch](/en/articles/minimal-http-server-handson-guide) — An introductory hands-on for understanding HTTP's true identity from zero, not a hands-on about Windows Server administration itself.

### Sophomore: Supplementary Deep-Dives

1. [Understanding Shadow Copies (VSS) From a Top 1% Perspective](/en/articles/windows-server-vss-guide)
2. [Understanding DFS Namespaces and DFS Replication From a "Top 1%" Perspective](/en/articles/windows-server-dfs-guide)
3. [Understanding IIS Application Pool Recycling From a "Top 1%" Perspective](/en/articles/windows-server-app-pool-recycling-guide)
4. [Understanding Print Servers and the Spooler From a "Top 1%" Perspective](/en/articles/windows-server-print-spooler-guide)

### Junior: Real-World-Scenario Hands-On

1. [The Top 1% Hands-On for Consolidating Multiple File Servers With a DFS Namespace and DFS Replication, and Experiencing Automatic Failover](/en/articles/windows-server-dfs-handson-guide) — the series' first genuine hands-on actually covering Windows Server administration itself.

### Senior (Graduation): Niche-Spec Hands-On

1. [The Top 1% Hands-On for Using SNI on IIS to Run Multiple Domains' TLS Certificates on a Single IP Address](/en/articles/windows-server-iis-sni-handson-guide)

**Work through and understand this one, and you're at graduation level, as a "Senior."**

### Graduate School: Security-Hardening Hands-On (An Attacker's Perspective)

1. [The Top 1% Hands-On for Seeing SMB1's Danger Firsthand and Defending With Protocol Disabling and Signing Enforcement](/en/articles/windows-server-smb1-hardening-handson-guide)

An educational, defense-focused hands-on lab, meant to strengthen the defenses of a test environment you manage yourself (it never performs an actual vulnerability exploit).

### Capstone Project

1. [The Windows Server Department's Capstone Project: Turning a Fictional Company's Windows Server Infrastructure Into a Portfolio Piece](/en/articles/windows-server-capstone-handson-guide)

An integrative exercise where you combine, on your own, the techniques learned individually in earlier hands-on labs (DFS namespace/replication, IIS SNI, application pool recycling, print spooler operations, SMB1 hardening, NTP time sync) into a single fictional company's Windows Server infrastructure. It calls for the ability to design from requirements, not just follow steps, and the deliverable is assembled as a portfolio piece usable in a job search.

### Architect and Beyond

No articles exist here yet. As with the other departments, this is expected to cover system-wide architecture design spanning multiple departments.

### Audio Learning Materials (Regardless of Grade)

- [[Listen] The Windows Server Operations Series, Fully Recapped](/en/articles/windows-server-audio-review-guide) (for reviewing after graduation)

## Web/API Department

A department whose growth started from a small number of articles, now the 9th department to reach "fully open," following Load Balancing. Its corresponding series is [api](/en/sitemap#series-list).

### General Education (Prerequisites)

None.

### Freshman: Fundamentals + Your First Hands-On

**Lecture (fundamentals, 1 article)**

1. [Understanding RESTful APIs — From HTTP/JSON Fundamentals to Real-World Design — From a Top 1% Perspective](/en/articles/restful-api-guide)

**Hands-On (fundamentals, 1 article)**

1. [A Top 1% Hands-On for Building a Simple RESTful API Yourself and Verifying Idempotency and Pagination With curl](/en/articles/restful-api-handson-guide)

**Work through and understand these two, and you're at a solid checkpoint as a "Freshman."**

### Sophomore: Supplementary Deep-Dives

1. [Understanding What's Actually Happening Behind a Payment API From a Top 1% Perspective](/en/articles/payment-api-guide) — a dense, real-world deep-dive using Stripe as the example, covering PaymentIntent's multi-stage lifecycle, webhooks, and PCI DSS compliance.
2. [Understanding How OAuth 2.0 Works From a Top 1% Perspective](/en/articles/oauth2-guide) — covers the authorization code flow and its distinction from authentication (OpenID Connect).
3. [Understanding the Difference Between GraphQL and RESTful APIs From a Top 1% Perspective](/en/articles/graphql-vs-rest-guide) — covers eliminating over-fetching and under-fetching.

### Junior: Real-World-Scenario Hands-On

1. [A Top 1% Hands-On for Building a Webhook Receiver Yourself and Experiencing Signature Verification and Handling a Retried Delivery](/en/articles/webhook-signature-handson-guide)

### Senior (Graduation): Niche-Spec Hands-On

1. [A Top 1% Hands-On for Implementing Rate Limiting Yourself With a Token Bucket, and Reproducing the Fixed Window's Boundary Burst](/en/articles/rate-limiting-handson-guide)

**Work through and understand this one, and you're at graduation level, as a "Senior."**

### Graduate School: Security-Hardening Hands-On (An Attacker's Perspective)

1. [A Top 1% Hands-On for Reproducing JWT's 'alg: none' Vulnerability Yourself and Confirming Defense via an Explicit Allowed-Algorithm List](/en/articles/jwt-alg-none-handson-guide)

An educational, defense-focused hands-on lab, meant to strengthen the defenses of a test environment you manage yourself (it contains no procedure for attacking a third party's system).

### Capstone Project

1. [The Web/API Department's Capstone Project: Turning a Fictional SaaS Startup's Public API Platform Into a Portfolio Piece](/en/articles/api-capstone-handson-guide)

An integrative exercise where you combine, on your own, the techniques learned individually in earlier hands-on labs (RESTful API idempotency design, authorization via OAuth 2.0, a structurally safe JWT verification implementation, rate limiting, webhook signature verification and deduplication) into a single fictional SaaS startup's public API platform. It calls for the ability to design from requirements, not just follow steps, and the deliverable is assembled as a portfolio piece usable in a job search.

### Architect and Beyond

No articles exist here yet. As with the other departments, this is expected to cover system-wide architecture design spanning multiple departments.

### Audio Learning Materials (Regardless of Grade)

- [[Listen] The Web/API Series, Fully Recapped](/en/articles/api-audio-review-guide) (for reviewing after graduation)

## Web Proxy/Caching Department

Following the Linux Infrastructure Department, this is the 12th department to become "fully open." Its corresponding series is [web-proxy](/en/sitemap#series-list).

### General Education (Prerequisites)

None.

### Freshman: Fundamentals + Your First Hands-On

**Lecture (fundamentals, 2 articles)**

1. [Understanding When to Use a Proxy vs. a Firewall From a Top 1% Perspective](/en/articles/proxy-firewall-guide)
2. [Understanding the Rise of HTTPS and the End of Proxy Caching From a Top 1% Perspective](/en/articles/http-caching-cdn-guide)

**Hands-On (fundamentals, 1 article)**

1. [The Top 1% Hands-On for Building an Explicit Proxy With Squid and Experiencing URL-Level Access Control](/en/articles/squid-proxy-handson-guide)

**Work through and understand these three, and you're at a solid checkpoint as a "Freshman."**

### Sophomore: Supplementary Deep-Dives

1. [Understanding PAC Files and WPAD From a Top 1% Perspective](/en/articles/pac-wpad-guide)
2. [Understanding the Difference Between Proxy Authentication Methods (Basic/NTLM/Kerberos) From a Top 1% Perspective](/en/articles/proxy-auth-guide)
3. [Understanding Cache-Control and the Vary Header From a Top 1% Perspective](/en/articles/cache-control-vary-guide)

### Junior: Real-World-Scenario Hands-On

1. [A Top 1% Hands-On for Building Squid as a Caching Proxy and Confirming HIT/MISS With the X-Cache Header](/en/articles/squid-caching-handson-guide)

### Senior (Graduating): Niche-Spec Hands-On

1. [A Top 1% Hands-On for Building a Transparent Proxy With iptables and Squid, and Experiencing How a Proxy Gets Forced Without Any Client Configuration](/en/articles/transparent-proxy-handson-guide)

**Work through and understand this one article, and you're at graduation level as a "Senior."**

### Graduate School: Security Hardening Hands-On (Attacker's Perspective)

1. [A Top 1% Hands-On for Reproducing Squid's Open-Proxy Danger Yourself and Defending With ACL-Based Access Restriction](/en/articles/squid-open-proxy-hardening-handson-guide)

This is an educational, defensive hands-on, meant to strengthen the defenses of an environment you yourself control (it contains no attack procedure directed at any third-party system whatsoever).

### Capstone Project

1. [The Web Proxy/Caching Department's Capstone Project: Turning a Fictional Multi-Site Retailer's Internet Access Infrastructure Into a Portfolio Piece](/en/articles/web-proxy-capstone-handson-guide)

An integrative exercise where you combine, on your own, the techniques mastered individually in earlier hands-on labs — explicit proxy construction and URL-level access control via Squid, cache control via Cache-Control/Vary, a transparent proxy via iptables and Squid, open-proxy hardening — and the knowledge from the lectures — auto-configuration via PAC files/WPAD, proxy authentication via Basic/NTLM/Kerberos — into a single fictional multi-site retailer's, "KoiKoi Retail's," internet access infrastructure. It demands the ability to design from requirements, not the ability to follow steps, and the deliverable is assembled as a portfolio usable in a job search too.

### Architect and Beyond

No articles yet. As with other departments, this is expected to cover system-wide architecture design spanning multiple departments.

### Audio Learning Materials (Regardless of Grade)

- [[Listen] The Web Proxy/Caching Fundamentals Series, Fully Recapped](/en/articles/web-proxy-audio-review-guide) (for reviewing after graduation)

## Storage Department

Following the Web/API Department, this is the 10th department to become "fully open." Its corresponding series is [storage](/en/sitemap#series-list).

### General Education (Prerequisites)

None.

### Freshman: Fundamentals + Your First Hands-On

**Lecture (fundamentals, 3 articles)**

1. [Understanding the Relationship Between RAID and Windows Disk Management From a Top 1% Perspective](/en/articles/disk-raid-fundamentals-guide)
2. [Understanding the Difference Between FC Cabling and LAN Cabling From a Top 1% Perspective](/en/articles/fc-san-fundamentals-guide)
3. [Understanding How the NTFS Filesystem Works From a Top 1% Perspective](/en/articles/ntfs-mft-internals-guide)

**Hands-On (fundamentals, 1 article)**

1. [A Top 1% Hands-On for Building a Linux Software RAID1 Array With mdadm and Reproducing a Disk Failure and Rebuild Yourself](/en/articles/mdadm-raid-handson-guide)

**Work through and understand these four, and you're at a solid checkpoint as a "Freshman."**

### Sophomore: Supplementary Deep-Dives

1. [Understanding RAID5 and RAID6 Parity Calculation From a Top 1% Perspective](/en/articles/raid5-parity-guide)
2. [Understanding How iSCSI Works From a Top 1% Perspective](/en/articles/iscsi-guide)
3. [Understanding Thin Provisioning From a Top 1% Perspective](/en/articles/thin-provisioning-guide)

### Junior: Real-World-Scenario Hands-On

1. [A Top 1% Hands-On for Building RAID5 With mdadm and Confirming Parity-Based Data Recovery Yourself](/en/articles/mdadm-raid5-handson-guide)

### Senior (Graduating): Niche-Spec Hands-On

1. [A Top 1% Hands-On for Creating an LVM Snapshot Yourself and Confirming What Copy-on-Write Really Is](/en/articles/lvm-snapshot-handson-guide)

**Work through and understand this one article, and you're at graduation level as a "Senior."**

### Graduate School: Security Hardening Hands-On (Attacker's Perspective)

1. [A Top 1% Hands-On for Reproducing an Unauthenticated iSCSI Takeover Yourself and Confirming CHAP Authentication's Defense](/en/articles/iscsi-chap-hardening-handson-guide)

This is an educational, defensive hands-on, meant to strengthen the defenses of an environment you yourself control (it contains no attack procedure directed at any third-party system whatsoever).

### Capstone Project

1. [The Storage Department's Capstone Project: Turning a Fictional Video Production Studio's Shared Storage Infrastructure Into a Portfolio Piece](/en/articles/storage-capstone-handson-guide)

An integrative exercise where you combine, on your own, the techniques mastered individually in earlier hands-on labs — redundancy and parity via RAID1 and RAID5, SAN construction and CHAP authentication via iSCSI, logical volume management and snapshots via LVM — into a single fictional video production studio's, "KoiKoi Studio's," shared storage infrastructure. It demands the ability to design from requirements, not the ability to follow steps, and the deliverable is assembled as a portfolio usable in a job search too.

### Architect and Beyond

No articles yet. As with other departments, this is expected to cover system-wide architecture design spanning multiple departments.

### Audio Learning Materials (Regardless of Grade)

- [[Listen] The Storage Fundamentals Series, Fully Recapped](/en/articles/storage-audio-review-guide) (for reviewing after graduation)

## Linux Infrastructure Department

Following the Storage Department, this is the 11th department to become "fully open." Its corresponding series is [linux](/en/sitemap#series-list). This department covers the fundamentals of Linux/OS itself, often referenced as prerequisite knowledge from other departments too. Its article count had already accumulated over time — it was organized into a grade structure, and now also carries Senior- and Graduate-School-level hands-on content.

### General Education (Prerequisites)

None.

### Freshman: Fundamentals + Your First Hands-On

**Lecture (fundamentals, 9 articles)**

1. [What Is a Daemon?](/en/articles/linux-daemon-guide)
2. [What Is a Library?](/en/articles/software-library-guide)
3. [User Space, Kernel Space, and TUN/TAP Devices](/en/articles/linux-user-kernel-space-guide)
4. [What Are Permissions (chmod)?](/en/articles/linux-file-permissions-guide)
5. [sysctl and /etc/sysctl.conf](/en/articles/linux-sysctl-guide)
6. [iptables (netfilter)](/en/articles/linux-iptables-guide)
7. [/etc and the Linux Directory Layout (FHS)](/en/articles/linux-filesystem-hierarchy-guide)
8. [How a Config File Actually "Takes Effect"](/en/articles/linux-config-activation-guide)
9. [Investigating Error Logs With journalctl](/en/articles/linux-journalctl-guide)

**Hands-On (fundamentals, 1 article)**

1. [The Top 1% Hands-On for Tracking Down a File or Directory Yourself With find](/en/articles/linux-find-guide)

**Work through and understand these ten, and you're at a solid checkpoint as a "Freshman."**

### Sophomore: Supplementary Deep-Dives

1. [Understanding curl's Inner Workings](/en/articles/curl-guide)
2. [What Is a Framework?](/en/articles/software-framework-guide)
3. [How cat > file << 'EOF' Works](/en/articles/linux-heredoc-redirect-guide)
4. [How Git Works](/en/articles/git-basics-guide)
5. [How Nginx Works](/en/articles/nginx-fundamentals-guide)

### Junior: Real-World-Scenario Hands-On

1. [The Top 1% Hands-On for Building a Custom Virtual Host and Reverse Proxy With Nginx](/en/articles/nginx-handson-guide)

### Senior (Graduating): Niche-Spec Hands-On

1. [A Top 1% Hands-On for Building a Linux Namespace Yourself and Experiencing What a 'Container' Really Is](/en/articles/linux-namespaces-handson-guide)
2. [A Top 1% Hands-On for Building Linux cgroups (Control Groups) Yourself and Experiencing the Other Half of a 'Container'](/en/articles/linux-cgroups-handson-guide)

**Work through and understand these two articles, and you're at graduation level as a "Senior."**

### Graduate School: Security Hardening Hands-On (Attacker's Perspective)

1. [A Top 1% Hands-On for Reproducing the SUID Bit's Danger Yourself and Confirming Least-Privilege Defense via Capabilities](/en/articles/linux-suid-capabilities-handson-guide)

This is an educational, defensive hands-on, meant to strengthen the defenses of an environment you yourself control (it contains no attack procedure directed at any third-party system whatsoever).

### Capstone Project

1. [The Linux Infrastructure Department's Capstone Project: Turning a Fictional In-House Developer Platform Into a Portfolio Piece](/en/articles/linux-capstone-handson-guide)

An integrative exercise where you combine, on your own, the techniques mastered individually in earlier hands-on labs — investigating with find, a reverse proxy via Nginx, process isolation via namespaces, least-privilege design via Capabilities instead of SUID — and the knowledge from the lectures — daemons, permissions, iptables, journalctl, how a config file takes effect — into a single fictional startup's, "KoiKoi Dev's," in-house developer platform. It demands the ability to design from requirements, not the ability to follow steps, and the deliverable is assembled as a portfolio usable in a job search too.

### Architect and Beyond

No articles yet. As with other departments, this is expected to cover system-wide architecture design spanning multiple departments.

### Audio Learning Materials (Regardless of Grade)

- [[Listen] The Linux/OS Fundamentals Series, Fully Recapped](/en/articles/linux-audio-review-guide) (for reviewing after graduation)

## What's Next

- **All 12 "fully open" departments (Active Directory, AWS, Ansible/IaC, VPN, DNS, Mail, Windows Server, Load Balancing, Web/API, Storage, Linux Infrastructure, Web Proxy/Caching) now have a capstone hands-on (a graduation project) combining content across multiple grades.** The deliverable is assembled as a GitHub-repository-style format usable as a job-hunting portfolio. This completes the department and grade structure currently planned for this site.
- Future directions for expansion could include adding "Architect and Beyond" content (system-wide architecture design spanning multiple departments) to each department, or adding entirely new departments.
