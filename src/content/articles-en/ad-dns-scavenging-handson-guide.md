---
title: "The Top 1% Hands-On for Configuring AD-Integrated DNS Scavenging (Automatic Cleanup of Stale Records)"
description: "Set up scavenging (automatic deletion of stale records) to prevent a retired PC's old A record from lingering in a DNS zone forever, cluttering it into a 'DNS hoarder's house.' Covers the dynamic-update timestamp, the two-stage grace period made of a refresh interval and a no-refresh interval, and why scavenging is disabled by default."
series: "active-directory"
subSeries: "handson"
order: 40
tags: ["windows-server", "active-directory", "infra", "dns", "handson"]
emoji: "🧹"
pubDate: 2026-09-26
---

## Introduction

- **What You'll Learn From This Article**: You'll actually configure **scavenging**, to prevent old DNS records — from a retired PC, or a device that's since been renamed — from lingering in a zone forever. You'll understand the timestamp recorded by dynamic updates, the two-stage grace period made of a **refresh interval** and a **no-refresh interval**, and why scavenging is disabled by default.
- **Intended Audience**: Readers who've noticed that `nslookup` keeps returning hits for a device name that shouldn't exist anymore.
- **Estimated Reading Time**: About 20 minutes (about 40 minutes if you build along with the hands-on)

This article is part of the [Top 1% Series Complete Article Guide](/en/sitemap), the 40th article in the [Active Directory Series](/en/sitemap#series-list).

## Prerequisites

- [Understanding DNS Zones and Records from a "Top 1%" Perspective](/en/articles/dns-zones-records-guide): This article assumes you already know about dynamic updates and AD-integrated zones.

## Why DNS Records Just Keep Piling Up Left Alone

A domain-joined client registers its own A record with a DNS server, via dynamic updates, at boot and whenever its IP address changes. But even after that PC is physically retired, or never boots again, **there's no mechanism at all for that PC to tell the DNS server, "I'm not using this anymore, please delete it."** As a result, left unattended, a retired device's record just lingers in the zone indefinitely. Enough of this accumulates and you get what's sometimes called a "DNS hoarder's house" — a zone cluttered with garbage records that never get used for name resolution.

## The Big Picture

This hands-on consists of three steps.

```mermaid
graph LR
    Step1["Step1<br/>Enable aging on the zone"]
    Step2["Step2<br/>Configure the scavenging<br/>schedule on the server"]
    Step3["Step3<br/>Confirm the record's<br/>timestamp firsthand"]
    Step1 --> Step2 --> Step3
```

## Hands-On Steps

### Step 1: Enable aging on the zone

Enable aging (the feature that tracks how stale a record is) on your target AD-integrated zone.

```powershell
Set-DnsServerZoneAging -Name "example.com" -Aging $true -RefreshInterval 7.00:00:00 -NoRefreshInterval 7.00:00:00
```

**The two intervals specified here are the heart of this hands-on.** When a record gets dynamically updated, it first enters the **no-refresh interval** (7 days, by default). During this period, an attempt to update the timestamp with identical content is ignored. Once the no-refresh interval ends, it enters the **refresh interval** (also 7 days, by default) — and if the timestamp gets updated during this window, the record stays alive. **Only a record whose timestamp was never updated through both periods combined (14 days total, by default) becomes eligible for deletion.**

### Step 2: Configure the scavenging schedule on the server

Enabling aging on the zone alone doesn't actually run any deletion. You also need to configure a schedule on the DNS server itself for running scavenging.

```powershell
Set-DnsServerScavenging -ScavengingState $true -ScavengingInterval 7.00:00:00 -ApplyOnAllZones
```

**The zone-side "enable aging" setting and the server-side "run scavenging" setting are two completely separate on/off switches.** Enabling only one of them doesn't produce the behavior you'd expect.

### Step 3: Confirm the record's timestamp firsthand

Check the target A record's timestamp.

```powershell
Get-DnsServerResourceRecord -ZoneName "example.com" -RRType A | Select-Object HostName, Timestamp
```

As long as a client with dynamic updates enabled keeps refreshing its own record periodically, its timestamp keeps updating, and the record never gets deleted. **On the other hand, if that device stays powered off long enough for the combined refresh-plus-no-refresh interval (14 days by default) to elapse, that record gets automatically deleted the next time scavenging runs.**

## What a Pro Sees Here (Top 1% Understanding)

### Why scavenging is disabled by default

Unlike many AD DS features, scavenging is **disabled by default.** That's because a misconfiguration risks accidentally deleting a record that's still actively in use. In particular, statically (manually) registered records, and records from older devices that don't support dynamic updates, either have no timestamp at all or one that never updates — so they're excluded from scavenging entirely (a record with no timestamp is excluded from scavenging by design). **Fail to understand this "static records are excluded" specification correctly, and you risk the serious incident of accidentally deleting an important server's record.** That's exactly why most best practices recommend setting a sufficiently long grace period first, and enabling scavenging cautiously.

### Why the two-stage grace period exists

The reason for the two-stage mechanism of a no-refresh interval plus a refresh interval is **to avoid unnecessary write load on the DNS server.** If timestamp updates were always accepted, every single dynamic update — which can happen frequently — would keep generating write operations on the DNS server (and, for an AD-integrated zone, the replication that goes with it). The no-refresh interval discards redundant update requests that arrive repeatedly in a short span as "safe to ignore," while at least one update during the refresh interval is enough to conclude the record is still alive — that's the design.

## Common Misconceptions and Pitfalls

- **Misconception 1: "Enabling aging on a zone alone automatically runs scavenging."**
  The zone-side "enable aging" and the server-side "configure the scavenging schedule" need to be done separately.
- **Misconception 2: "Statically registered records are also subject to scavenging."**
  A static record has no timestamp, so by default it's excluded from scavenging.
- **Misconception 3: "The refresh interval and no-refresh interval are redundant settings that do the same thing."**
  These two play different roles, and only together do they determine the full grace period before a record becomes eligible for deletion.

## Troubleshooting Perspective

1. **You configured scavenging, but old records aren't being deleted**: Check whether both zone-side aging and the server-side scavenging schedule are enabled, and whether the grace period (refresh plus no-refresh) simply hasn't elapsed yet.
2. **A record you thought was still in use got deleted**: If it belongs to a device that doesn't support dynamic updates, consider re-registering it as a static record, or excluding that zone from scavenging.
3. **A scavenging configuration change doesn't seem to take effect**: `Set-DnsServerScavenging` is configured per server, so if you have multiple DNS servers, check whether it's configured on each one.

## Summary

- A record registered via dynamic updates doesn't get automatically deleted just because the device that registered it disappears.
- Only a record whose timestamp was never updated through both the no-refresh interval and refresh interval becomes eligible for scavenging.
- The zone-side "enable aging" and the server-side "scavenging schedule" need to be configured separately.
- A static record has no timestamp, so it's excluded from scavenging by default.

**Takeaways to Apply Today**
1. If you notice `nslookup` returning hits for a device name that shouldn't exist, check whether scavenging is enabled.
2. When enabling scavenging for the first time, set a sufficiently long grace period and roll it out to production cautiously.

## References

- [DNS Zone Scavenging and Aging | Microsoft Learn](https://learn.microsoft.com/en-us/troubleshoot/windows-server/networking/dns-scavenging-aging)
- [Set-DnsServerScavenging | Microsoft Learn](https://learn.microsoft.com/en-us/powershell/module/dnsserver/set-dnsserverscavenging)
