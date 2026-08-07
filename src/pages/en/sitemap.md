---
layout: ../../layouts/MarkdownPageLayout.astro
title: "Top 1% Series — Full Article Guide: Reading Order and Sitemap"
description: "The table of contents, recommended reading order, and sitemap for every article in the Top 1% Series."
lang: "en"
altHref: "/sitemap"
---

## About this series

This series aims for the level of understanding held by "the top 1% of infrastructure engineers, even among those working at the leading infrastructure companies like AWS and Google." Rather than just memorizing operational steps, the goal is to thoroughly explain:

- The internal mechanics and design rationale behind why something is built the way it is
- How to actually diagnose and troubleshoot the problems that come up in production

...in a way that lets even a beginner climb the ladder one step at a time. When a topic gets too large, we don't force it into a single article — we split it by theme and link the articles together. This page is the table of contents, recommended reading order, and sitemap across all of them. It gets updated every time a new topic is added.

## Recommended reading order

This page used to cram every article into a single giant diagram, but chaining everything back through the iDRAC article as the root made things — especially everything under the VPN/L2TP-IPsec series — too dense to read. So article-level derivation is now shown within each series' own section (in "Series list" below), and this diagram is scaled back to a simple map of **how the series relate to each other.**

```mermaid
graph TB
    Idrac["iDRAC / BMC Series"]
    Network["Networking Fundamentals Series"]
    Vpn["VPN / L2TP-IPsec Series"]
    Security["Security Fundamentals Series"]
    Linux["Linux / OS Fundamentals Series"]
    Telephony["Telephony & Access Network Series"]
    Api["Web / API Series"]

    Idrac --> Network
    Idrac --> Api
    Network --> Vpn
    Vpn --> Security
    Vpn --> Linux
    Vpn --> Telephony
```

**The basic path**: Start with the iDRAC article, branch into the Networking Fundamentals and Web/API series, follow the L2TP/IPsec article's thread from Networking Fundamentals into the VPN/L2TP-IPsec series, and dig deeper from there into Security Fundamentals, Linux/OS Fundamentals, and Telephony. That's the main line of derivation between articles. That said, every article is written to be **fully readable on its own**, so feel free to start with whichever series or article interests you. Note also that some articles in the Networking Fundamentals series (NAT/NAPT, virtual IPs, TCP/UDP sessions, DNS) actually branch off from the L2TP/IPsec article in the VPN series — the series don't form a strict one-way tree; some cross-reference each other.

The recommended reading order within each series is noted in that series' description under "Series list" below (the ①②③... numbers before each article title are the recommended order within that series). Goal-based recommended routes are collected in "Recommended routes by reader type," next.

## Recommended Routes by Reader Type

This blog is written for a wide range of readers — from people with no experience aiming to become infrastructure engineers, to top-tier AWS/Google engineers earning the equivalent of ¥50 million or more a year. You don't have to read every article in order, so here are three goal-based routes (route ② assumes you've finished route ①; route ③ assumes you've finished ① and ②).

### ① For those aiming to become an infrastructure engineer with no prior experience

A route that covers the foundational way of thinking in each area, without going too deep.

1. [What Is iDRAC? Understanding How It Works from a "Top 1%" Perspective](/en/articles/idrac-guide)
2. [Understanding the Network Stack from a "Top 1%" Perspective](/en/articles/network-stack-guide)
3. [Understanding the Differences Between Hubs, Switches (L2SW), L3 Switches, and Routers from a "Top 1%" Perspective](/en/articles/network-devices-guide)
4. [Understanding How NAT/NAPT Works from a "Top 1%" Perspective](/en/articles/nat-guide)
5. [Understanding How DNS Works from a "Top 1%" Perspective](/en/articles/dns-guide)
6. [Understanding the Difference Between Telephone Lines and IP Networks from a "Top 1%" Perspective](/en/articles/circuit-switching-ppp-guide)
7. [Understanding the Evolution of Access-Line Technology — ADSL, Fiber, and More — from a "Top 1%" Perspective](/en/articles/access-network-guide)
8. [What Is a RESTful API? Understanding from HTTP/JSON Basics to Practical Design from a "Top 1%" Perspective](/en/articles/restful-api-guide)

### ② For mid-career engineers aiming to go from ¥5M to ¥10M a year

Assumes you've finished route ①. Digs into the VPN, cryptography, and certificate topics that come up most often in practice.

1. [Understanding How L2TP/IPsec Works from a "Top 1%" Perspective](/en/articles/l2tp-ipsec-guide)
2. [Understanding Windows Server (RRAS) L2TP/IPsec VPN Setup and IP Address Management from a "Top 1%" Perspective](/en/articles/windows-server-l2tp-vpn-guide)
3. [Understanding PKI and Digital Certificates from a "Top 1%" Perspective](/en/articles/pki-guide)
4. [Understanding Symmetric Encryption (AES) and HMAC/AEAD from a "Top 1%" Perspective](/en/articles/symmetric-encryption-guide)
5. [Understanding the Relationship Between TCP/UDP "Sessions" and Port Numbers from a "Top 1%" Perspective](/en/articles/tcp-udp-session-port-guide)
6. [Comparing L2TP/IPsec to Modern VPN Protocols from a "Top 1%" Perspective](/en/articles/vpn-protocols-comparison-guide)
7. [Understanding Site-to-Site VPN from a "Top 1%" Perspective](/en/articles/site-to-site-vpn-guide)
8. [Understanding Japanese Local Government Network Segregation and Security Clouds from a "Top 1%" Perspective](/en/articles/local-gov-network-guide)

### ③ For those aiming to become a top-1% engineer

Assumes you've finished routes ① and ②. Covers every remaining article, reaching into low-level implementation, real hardware builds, and edge cases.

1. [Understanding Server Power Design from a "Top 1%" Perspective](/en/articles/idrac-power-guide)
2. [Understanding the OS Boot Process After POST from a "Top 1%" Perspective](/en/articles/os-boot-process-guide)
3. [Understanding NIC Drivers and Linux Kernel Networking from a "Top 1%" Perspective](/en/articles/nic-driver-internals-guide)
4. [Understanding Virtual IPs (VIPs) and NIC Teaming's Virtual IP from a "Top 1%" Perspective](/en/articles/virtual-ip-guide)
5. [What Is a Daemon? Understanding Linux Background Processes from a "Top 1%" Perspective](/en/articles/linux-daemon-guide)
6. [What Is a Library? Understanding Static and Dynamic Linking from a "Top 1%" Perspective](/en/articles/software-library-guide)
7. [User Space, Kernel Space, and TUN/TAP Devices, Understood from a "Top 1%" Perspective](/en/articles/linux-user-kernel-space-guide)
8. [Understanding VoIP and SS7 — and the Real Path Your Traffic Takes — from a "Top 1%" Perspective](/en/articles/voip-ss7-guide)
9. [A "Top 1%" Hands-On Lab: Building Your Own L2TP/IPsec Server on Proxmox VE](/en/articles/l2tp-ipsec-lab-guide)

Finish this route and you'll have read all 25 articles in the series.

## Series list

### iDRAC / BMC Series

A series covering out-of-band server management. **Recommended order**: ① idrac-guide → ② idrac-power-guide → ③ os-boot-process-guide.

- [What Is iDRAC? Understanding How It Works from a "Top 1%" Perspective](/en/articles/idrac-guide) — The main article: iDRAC (BMC) overview, power design, licensing, security, and troubleshooting.
- [Understanding Server Power Design from a "Top 1%" Perspective](/en/articles/idrac-power-guide) — A deep dive into the power design touched on in the iDRAC article: AC/DC conversion and PSU redundancy (A/B grid, hot spares). Also readable standalone.
- [Understanding the OS Boot Process After POST from a "Top 1%" Perspective](/en/articles/os-boot-process-guide) — A deep dive into the bootloader, initramfs, and systemd (PID 1) stages after POST completes, plus the difference between Secure Boot and measured boot (spun off from the power article's POST/OS-boot section; also readable standalone).

### Networking Fundamentals Series

**Recommended order**: ① network-stack-guide → ② nic-driver-internals-guide → ③ network-devices-guide → ④ local-gov-network-guide → ⑤ virtual-ip-guide → ⑥ nat-guide → ⑦ tcp-udp-session-port-guide → ⑧ dns-guide.

- [Understanding the Network Stack from a "Top 1%" Perspective](/en/articles/network-stack-guide) — A deep dive into the layered structure of the NIC driver, IP, TCP/UDP, and the application layer.
- [Understanding NIC Drivers and Linux Kernel Networking from a "Top 1%" Perspective](/en/articles/nic-driver-internals-guide) — A further deep dive into interrupt handling, DMA, offloading, and kernel bypass.
- [Understanding the Differences Between Hubs, Switches (L2SW), L3 Switches, and Routers from a "Top 1%" Perspective](/en/articles/network-devices-guide) — How to tell these devices apart by OSI layer and forwarding method (MAC address tables, VLANs, spanning tree, ASIC/TCAM).
- [Understanding Japanese Local Government Network Segregation and Security Clouds from a "Top 1%" Perspective](/en/articles/local-gov-network-guide) — How the LGWAN-connected, My Number business, and internet-connected segments are actually implemented with VLANs/firewalls, plus a deep dive into the shared prefectural security cloud (spun off from the VLAN section of the network-devices-guide article; also readable standalone).
- [Understanding Virtual IPs (VIPs) and NIC Teaming's Virtual IP from a "Top 1%" Perspective](/en/articles/virtual-ip-guide) — The difference between the two ways a virtual IP is realized (IP takeover vs. a load balancer's NAT translation), plus NIC teaming's virtual IP (spun off from IP address management in redundant setups; also readable standalone).
- [Understanding How NAT/NAPT Works from a "Top 1%" Perspective](/en/articles/nat-guide) — The internals of the translation table, NAT behavior types, and how NAT-T works (spun off from the L2TP/IPsec article's NAT traversal section; also readable standalone).
- [Understanding the Relationship Between TCP/UDP "Sessions" and Port Numbers from a "Top 1%" Perspective](/en/articles/tcp-udp-session-port-guide) — What a TCP connection's state machine really is, how it differs from a NAT/firewall's pseudo-session, and why protocol numbers and port numbers aren't a 1:1 mapping (spun off from the L2TP/IPsec article's discussion of ESP and port numbers; also readable standalone).
- [Understanding How DNS Works from a "Top 1%" Perspective](/en/articles/dns-guide) — The hierarchy of name resolution, the division of labor between recursive resolvers and authoritative servers, how Windows and Linux prioritize among multiple DNS servers, and DNS resolution over a VPN connection (spun off from the L2TP/IPsec article's DNS server assignment via IPCP; also readable standalone).

### VPN / L2TP-IPsec Series

**Recommended order**: ① l2tp-ipsec-guide → ② windows-server-l2tp-vpn-guide → ③ vpn-protocols-comparison-guide → ④ l2tp-ipsec-lab-guide → ⑤ site-to-site-vpn-guide.

- [Understanding How L2TP/IPsec Works from a "Top 1%" Perspective](/en/articles/l2tp-ipsec-guide) — Why L2TP and IPsec are combined, the connection-establishment sequence, and a deep dive into NAT traversal.
- [Understanding Windows Server (RRAS) L2TP/IPsec VPN Setup and IP Address Management from a "Top 1%" Perspective](/en/articles/windows-server-l2tp-vpn-guide) — RRAS's address pool, and why a gateway is needed even though clients look like they're on the same subnet (a Windows Server implementation companion to the L2TP/IPsec article; also readable standalone).
- [Comparing L2TP/IPsec to Modern VPN Protocols from a "Top 1%" Perspective](/en/articles/vpn-protocols-comparison-guide) — A deep dive into the differences in design philosophy, implementation size, and mobile resilience against IKEv2/IPsec, OpenVPN, and WireGuard (spun off to dig into why L2TP/IPsec is called legacy; also readable standalone).
- [A "Top 1%" Hands-On Lab: Building Your Own L2TP/IPsec Server on Proxmox VE](/en/articles/l2tp-ipsec-lab-guide) — Build an L2TP/IPsec server on Proxmox VE with strongSwan and xl2tpd, and verify the connection sequence with tcpdump (a deliberate exception in this series: a hands-on build guide).
- [Understanding Site-to-Site VPN from a "Top 1%" Perspective](/en/articles/site-to-site-vpn-guide) — How it differs from remote-access VPN, the mechanics of IPsec tunnel mode and traffic selectors, and the practical considerations for building an IPsec tunnel between different vendors like Cisco and WatchGuard (spun off from the contrast with L2TP/IPsec; also readable standalone).

### Linux / OS Fundamentals Series

A series that takes execution-environment-level terms that keep showing up in the VPN protocol articles and gives each one a standalone deep dive. **Recommended order**: ① linux-daemon-guide → ② software-library-guide → ③ linux-user-kernel-space-guide.

- [What Is a Daemon? Understanding Linux Background Processes from a "Top 1%" Perspective](/en/articles/linux-daemon-guide) — How a daemon differs from a regular process, why protocol-handling software like an IKE daemon is implemented as one, and how systemd starts, monitors, and logs it (spun off from the daemon discussion in the modern-VPN-protocols comparison article; also readable standalone).
- [What Is a Library? Understanding Static and Dynamic Linking from a "Top 1%" Perspective](/en/articles/software-library-guide) — The difference between static linking and dynamic linking (shared libraries), how symbol resolution works, and why ABI compatibility becomes a real failure mode (spun off from the OpenSSL discussion in the modern-VPN-protocols comparison article; also readable standalone).
- [User Space, Kernel Space, and TUN/TAP Devices, Understood from a "Top 1%" Perspective](/en/articles/linux-user-kernel-space-guide) — How the CPU's privilege levels separate the two spaces, how system calls and context switches work, and how OpenVPN's TUN/TAP device operates (spun off from the user-space-implementation discussion in the modern-VPN-protocols comparison article; also readable standalone).

### Telephony & Access Network Series

**Recommended order**: ① circuit-switching-ppp-guide → ② access-network-guide → ③ voip-ss7-guide.

- [Understanding the Difference Between Telephone Lines and IP Networks from a "Top 1%" Perspective](/en/articles/circuit-switching-ppp-guide) — Circuit switching vs. packet switching, the historical background behind PPP, its reuse in PPPoE/L2TP, and the internals of CHAP/MS-CHAPv2 challenge-response authentication (a deep dive spun off from the PPP portion of the L2TP/IPsec article; also readable standalone).
- [Understanding the Evolution of Access-Line Technology — ADSL, Fiber, and More — from a "Top 1%" Perspective](/en/articles/access-network-guide) — The differences between a telephone line, ADSL, and fiber (FTTH) as ways of realizing an access line, how the PON architecture works, and the relationship between Ethernet and an IP network (spun off from the telephone-lines-and-PPP article; also readable standalone).
- [Understanding VoIP and SS7 — and the Real Path Your Traffic Takes — from a "Top 1%" Perspective](/en/articles/voip-ss7-guide) — The separation of call control (SS7 signaling) from voice transport (VoIP media), how SIP/RTP work, and the real path a home PC's traffic takes to reach a service on the internet (spun off from the telephone-lines-and-PPP article; also readable standalone).

### Web / API Series

- [What Is a RESTful API? Understanding from HTTP/JSON Basics to Practical Design from a "Top 1%" Perspective](/en/articles/restful-api-guide) — A deep dive into HTTP, REST, JSON, authentication, idempotency, and pagination.

### Security Fundamentals Series

**Recommended order**: ① pki-guide → ② symmetric-encryption-guide.

- [Understanding PKI and Digital Certificates from a "Top 1%" Perspective](/en/articles/pki-guide) — A deep dive into public-key cryptography, Diffie-Hellman key exchange, digital signatures, CSRs, and certificate chain verification (spun off from L2TP/IPsec's certificate authentication; also readable standalone).
- [Understanding Symmetric Encryption (AES) and HMAC/AEAD from a "Top 1%" Perspective](/en/articles/symmetric-encryption-guide) — A deep dive into block cipher internals, the differences between CBC/CTR/GCM modes, and HMAC-based tamper detection (spun off from L2TP/IPsec's ESP encryption; also readable standalone).

## What's next

Once the iDRAC-related series reaches a good stopping point, we plan to add a new series on a different theme (TBD). When a new series is added, this page will be updated too.
