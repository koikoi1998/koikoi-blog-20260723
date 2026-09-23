---
title: "Understanding What an ISP Is from a Top-1% Perspective — Why a Local Cable TV Company Sometimes Sits Upstream of Your Corporate DNS"
description: "This series has repeatedly said 'point your forwarder at the DNS server your ISP provides,' without ever explaining what an ISP itself actually is. This article systematically covers what an ISP actually provides, the Tier 1/Tier 2/Tier 3 hierarchy and the difference between peering and transit, and why, in Japan, a local cable TV company is often also your ISP — complete with the history behind it."
series: "active-directory"
subSeries: "supplementary"
order: 23
tags: ["windows-server", "active-directory", "dns", "isp", "network", "infra"]
emoji: "🌐"
pubDate: 2026-09-23
---

## Introduction

- **What you'll get from this article**: [Understanding Why AD Environment DNS Is Designed the Way It Is](/en/articles/ad-dns-guide) repeatedly said "point your forwarder at the DNS server your ISP provides, or at public DNS," without ever explaining what the **ISP (Internet Service Provider) itself** actually is or does. This article systematically covers what an ISP actually provides, the industry's Tier 1/Tier 2/Tier 3 hierarchy, and a question that comes up often in practice: "why is a local cable TV company's DNS server sometimes what corporate DNS points to upstream (as a forwarder)?" — along with the history behind it.
- **Intended audience**: Readers who use the word "ISP" regularly but can't explain what that company actually does, or how it provides the on-ramp to the internet.
- **Estimated reading time**: About 15 minutes

This article is part of the [Top 1% Series — Full Article Guide](/en/sitemap), and the 23rd entry in the [Active Directory series](/en/sitemap#series-list). Reading [Understanding Why AD Environment DNS Is Designed the Way It Is](/en/articles/ad-dns-guide) first will make this article easier to follow.

## Prerequisite Knowledge

- **Forwarder**: Covered in [Understanding Why AD Environment DNS Is Designed the Way It Is](/en/articles/ad-dns-guide) — the mechanism where a corporate DNS server forwards queries it can't resolve itself to a pre-configured external DNS server.
- **Access line**: The "last mile" segment connecting a customer's home or site to the carrier's nearest facility. The different technologies behind this — DSL, fiber, and so on — are covered in [Understanding the Technical Evolution of Access Lines](/en/articles/access-network-guide).

## Getting the Big Picture

### In a nutshell

**An ISP (Internet Service Provider) is the operator that actually connects a subscriber's access line to the single, giant, globally connected network called "the internet."** It's not just "lending you a line" — most ISPs also bundle in the function of assigning a global IP address to the subscriber, and often the **DNS recursive resolver** (a name-resolution proxy service) covered in [Understanding Why AD Environment DNS Is Designed the Way It Is](/en/articles/ad-dns-guide), as part of the line contract itself. When corporate DNS documentation says to point a forwarder at "the DNS server your ISP provides," it's referring to exactly this bundled resolver service.

```mermaid
graph LR
    subgraph Customer["Subscriber side"]
        Office["Corporate network"]
    end
    subgraph ISPNet["ISP (Internet Service Provider)"]
        Access["Access-line termination equipment"]
        DnsSvc["DNS recursive resolver<br/>(bundled with the line contract)"]
        GIP["Global IP address assignment"]
    end
    subgraph Backbone["Internet backbone"]
        Tier1["Tier 1 operators<br/>(interconnect for free via peering)"]
    end
    Office -->|Access line| Access
    Access --> GIP
    Office -.Forwarder.-> DnsSvc
    ISPNet -->|Transit (paid)| Backbone
```

## Deep Dive into the Fundamentals

### The ISP hierarchy: Tier 1, Tier 2, and Tier 3

ISPs are broadly classified into three tiers, based on scale and how they connect to each other.

- **Tier 1 operators**: The topmost operators, forming the internet's backbone. Tier 1 operators interconnect with each other via **peering** — exchanging traffic directly, as equals, with no money changing hands — and this web of interconnections alone lets them reach every route on the internet.
- **Tier 2 operators**: Also peer with other operators, but since peering alone doesn't reach every route worldwide, they buy the shortfall as **transit** (a paid connection where a higher-tier operator carries your traffic on your behalf) from Tier 1 operators.
- **Tier 3 operators**: Peer little or not at all, and connect to the internet purely by purchasing transit from higher-tier operators. Most operators that provide the "last mile" access line to businesses and homes fall into this tier.

Most of the "ISPs" we contract with day to day are Tier 2 or Tier 3 — it's only by having their upstream operator carry their traffic that they're able to reach every server on the internet in the first place.

### Why a cable TV company is often also an ISP in Japan

Check the forwarder settings in a corporate DNS server, and you'll often run into a local cable TV company (a CATV operator) DNS server sitting upstream. This isn't a coincidence — it has a clear historical origin.

A cable TV company is, at its core, an operator that already **ran coaxial cable (or a mix of coax and fiber) to nearly every building in its service area**, originally to deliver TV broadcasts. As covered in [Understanding the Technical Evolution of Access Lines](/en/articles/access-network-guide), the cost of newly laying an access line — the so-called last-mile problem — is enormous, and that's a major barrier to entry. But a cable TV company already owned this asset: transmission lines already reaching nearly every home. By adopting technology like DOCSIS to carry internet data signals in the frequency bands TV broadcasts weren't using, they could enter the internet access business at relatively low cost.

In Japan, Musashino-Mitaka Cable Television is credited as the first to launch cable internet service, in 1996; by 1999–2000, around 90 cable TV operators nationwide had expanded into offering internet access. Today, operators like J:COM, which bundle cable TV and internet access together, have grown into Japan's second-largest ISP after the NTT group.

<details>
<summary>Why does the forwarder tend to stay pointed at the ISP's DNS server?</summary>

When a company signs a new internet line contract, the ISP's DNS server IP address gets handed over as a default value through the router's configuration (via PPPoE or DHCP). In many real-world environments, unless someone deliberately changes that default over to a public DNS server (like `8.8.8.8`), the ISP's DNS server just keeps being used as the forwarder. This isn't a technical necessity — **it's an operational artifact of "the initial setting from when the line was contracted just never got revisited."** Forget to update the forwarder setting after switching line providers, and you can end up still sending queries to a DNS server belonging to an ISP you've already canceled — a real, practical failure mode.

</details>

## What Top-1% Engineers See

### Which should your forwarder point to: the ISP's DNS server, or public DNS?

As touched on in the "Forwarder redundancy and selection" section of [Understanding Why AD Environment DNS Is Designed the Way It Is](/en/articles/ad-dns-guide), it's considered good practice to combine multiple, different upstream providers for your forwarders. An ISP's DNS server tends to be located geographically and topologically close to that ISP's own subscribers, which often means faster responses. Public DNS, on the other hand, runs on a highly available, globally distributed anycast infrastructure, with the advantage of being independent of any single ISP's outages. A top-1% engineer doesn't oversimplify this into "one is just better" — they understand **both sets of tradeoffs and deliberately combine multiple providers to avoid depending on a single ISP.**

## Common Misconceptions and Pitfalls

- **Misconception 1: "An ISP just lends you an internet line — nothing more."**
  Most ISPs bundle in more than just the line itself — global IP address assignment and a DNS recursive resolver are often included as part of the same contract. When corporate DNS documentation refers to "the ISP's DNS server" as a forwarder target, it's referring to exactly this bundled DNS function.
- **Misconception 2: "Cable TV companies offering internet access is some odd, recent business model."**
  Cable-TV-provided internet access in Japan dates back to 1996 — nearly 30 years of history at this point. It's a rational business decision built on repurposing transmission infrastructure that was already laid for TV broadcasting.
- **Misconception 3: "Tier 1/Tier 2/Tier 3 is just a classification of how big each operator's business is."**
  This hierarchy isn't really about scale — it's about **connection method**: whether peering alone (free, mutual interconnection) is enough to reach the entire world, or whether the operator needs to buy transit (a paid connection) from a higher-tier operator.

## Troubleshooting Perspective

ISP/forwarder-related trouble is usually caused by a contract change or a default setting that got left unattended.

1. **Corporate DNS's forwarder suddenly stops responding**: If that forwarder points at an ISP's DNS server, check whether a line contract change or ISP switch happened recently. A canceled ISP's DNS server simply won't respond anymore.
2. **External name resolution becomes unstable during specific hours**: If the forwarder depends on a single ISP's DNS server, it's directly exposed to that ISP's local congestion or outages. Registering an additional provider — public DNS, for example — spreads that risk out.
3. **Name resolution speed differs by site even under the same ISP contract**: If the ISP's DNS servers are geographically distributed, different sites may end up answered by different servers, leading to response-time differences depending on the route.

### Prevention and Long-Term Countermeasures

- Register multiple, different upstream providers — an ISP's DNS server plus public DNS, for example — as forwarders.
- Whenever switching internet line providers (ISPs), always include a forwarder-configuration review in the checklist.
- Document which ISP and which service each forwarder's DNS server is actually tied to.

## Summary

- An ISP is the operator that connects a subscriber's access line to the internet, and beyond just providing the line, it typically bundles in global IP address assignment and a DNS recursive resolver as part of the same package.
- ISPs form a hierarchy of Tier 1 (backbone, reaches the entire world via peering alone), Tier 2 (peering plus some purchased transit), and Tier 3 (purchased transit only) — most ISPs we actually contract with fall into Tier 2 or Tier 3.
- Cable TV companies commonly also acting as ISPs in Japan traces back to nearly 30 years of history, starting in 1996, of repurposing transmission lines originally laid for TV broadcasting to also carry internet access.
- Corporate DNS forwarders often end up pointed at an ISP's DNS server simply because that was the default at contract time and it never got revisited — combining multiple providers spreads that risk out.

**What to keep in mind starting today**
1. Check whether your forwarders depend on a single ISP's DNS server alone.
2. Whenever switching internet line providers (ISPs), don't forget to add a forwarder-configuration review to the checklist.

## References

- [Tier 1 network | Wikipedia](https://en.wikipedia.org/wiki/Tier_1_network)
- [Internet Service Provider 3-Tier Model | ThousandEyes](https://www.thousandeyes.com/learning/techtorials/isp-tiers)
- [What Is Cable Television | Japan Cable Television Association](https://www.catv-jcta.jp/p/service/cabletv.html)
