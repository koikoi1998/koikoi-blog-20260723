---
title: "A Hands-On Lab: Building Trust Between Two Independent Forests in an Acquisition Scenario — Forest Trusts, and What a Trust Alone Doesn't Solve"
description: "Picture an acquired company's AD forest (acquired.example) that grew up completely independent of your own (example.com). Build a forest trust between two genuinely independent forests, and confirm cross-forest resource access with your own hands. Unlike the automatic trust relationships covered in the multi-domain, multi-tree hands-on lab, trust between independent forests must always be built manually — and this lab also covers what a trust alone doesn't solve for user and data consolidation, plus where ADMT (Active Directory Migration Tool) actually stands today."
series: "active-directory"
subSeries: "handson"
order: 16
tags: ["windows-server", "active-directory", "infra", "identity", "handson", "trust"]
emoji: "🤝"
pubDate: 2026-09-25
---

## Introduction

- **What you'll get from this article**: In [Hands-On: Building a Multi-Domain, Multi-Tree AD Forest](/en/articles/ad-multidomain-handson-guide), you added a child domain and a separate tree **within the same forest**, and watched trust relationships form automatically. This article covers the opposite scenario: **two entirely separate forests that have always operated independently** (say, your own company's AD forest and an acquired company's) — you'll actually build a **forest trust** between them and confirm cross-forest resource access works. Along the way, you'll also sort out what a trust doesn't solve — actually consolidating user accounts and data — and where the dedicated tool for that, ADMT (Active Directory Migration Tool), actually stands today.
- **Intended audience**: Anyone who's finished [Hands-On: Building a Multi-Domain, Multi-Tree AD Forest](/en/articles/ad-multidomain-handson-guide), understands trust within a single forest, and wants to confirm what's different in the more realistic scenario of **consolidating two genuinely separate companies, two genuinely separate forests.**
- **Estimated reading time**: About 25 minutes (budget 1.5–2 hours if you're actually building this alongside the article)

This article is part of the [Top 1% Series: Full Article Guide](/en/sitemap), the 16th in the [Active Directory series](/en/sitemap#series-list). Reading [Hands-On: Building a Multi-Domain, Multi-Tree AD Forest](/en/articles/ad-multidomain-handson-guide) first is strongly recommended. For the actual VM-building steps, see [Hands-On Prep Manual](/en/articles/handson-prep-guide) and [Setting Up Windows Server for the First Time](/en/articles/windows-server-setup-guide).

## Prerequisite Knowledge

- **A forest is the topmost security boundary**: As covered in [Understanding AD vs. DC, and Domains vs. Forests](/en/articles/ad-dc-fundamentals-guide), different forests don't share the configuration or schema partitions, and no trust relationship forms between them automatically.
- **How this differs from trust within a single forest**: In contrast to the **automatic** trust between parent/child domains or tree roots confirmed in [Hands-On: Building a Multi-Domain, Multi-Tree AD Forest](/en/articles/ad-multidomain-handson-guide), the trust between independent forests covered here (a **forest trust**) **never happens at all unless an administrator explicitly builds it.**

## Hands-On Prerequisites

- Two Windows Server 2025 VMs, each already built as a DC for its own, independent, existing AD forest (reuse `example.com` from the previous hands-on lab, or build it fresh).
- One more, newly built, representing **a completely separate forest for an acquired company.** This article uses the following hostnames and domain names.

| Role | Hostname | Domain name |
|---|---|---|
| Your own forest's DC (existing) | `DC-CORP` | `example.com` |
| The acquired company's forest's DC (new) | `DC-ACQ` | `acquired.example` |

Building `DC-ACQ` follows exactly the same steps as building the forest root domain in [Hands-On: Building a Multi-Domain, Multi-Tree AD Forest](/en/articles/ad-multidomain-handson-guide) (just change the domain name to `acquired.example`).

## Hands-On Steps

### Step 1: Establish two-way DNS name resolution

Before building a forest trust, **both DCs need to be able to resolve each other's domain name.** Configure a **conditional forwarder**, covered in [Understanding AD's DNS](/en/articles/ad-dns-guide), on each DC.

Run on `DC-CORP`:

```powershell
Add-DnsServerConditionalForwarderZone -Name "acquired.example" -MasterServers <DC-ACQ's IP address>
```

Run on `DC-ACQ`:

```powershell
Add-DnsServerConditionalForwarderZone -Name "example.com" -MasterServers <DC-CORP's IP address>
```

Confirm `nslookup` works in both directions before moving on.

```powershell
nslookup acquired.example <run on DC-CORP>
nslookup example.com <run on DC-ACQ>
```

### Step 2: Build the forest trust

On `DC-CORP`, use the `netdom` command to build a two-way forest trust.

```powershell
netdom trust example.com /d:acquired.example /add /twoway `
    /UserD:acqadmin /PasswordD:* `
    /UserO:corpadmin /PasswordO:*
```

- `/d:acquired.example`: Specifies the other domain (forest) you're trusting.
- `/twoway`: Makes the trust bidirectional (a one-way trust is also possible).
- `/UserD` / `/PasswordD`: Administrator credentials for the other side (acquired.example).
- `/UserO` / `/PasswordO`: Administrator credentials for your own side (example.com).

On success, `acquired.example` shows up under the "Trusts" tab of `example.com`'s properties in the Active Directory Domains and Trusts MMC console. **In the [multi-domain, multi-tree hands-on lab](/en/articles/ad-multidomain-handson-guide), this same kind of trust formed automatically the moment you added a child domain or tree root — no action needed. Here, because these are genuinely independent forests, the trust will never, ever form unless you actually run this `netdom trust` command.** This exact difference is the single most important thing to feel in this hands-on lab.

<details>
<summary>SID filtering: a default security feature</summary>

A forest trust has a protective feature called **SID filtering** enabled by default. This prevents the trusted forest from maliciously claiming a SID (Security Identifier) that says "I'm actually a member of Enterprise Admins," and having the trusting forest believe it unconditionally. If you can't fully trust the acquired environment, or from a security-audit standpoint, it's recommended not to disable this default protection.

</details>

### Step 3: Confirm cross-forest resource access

On `DC-CORP`, create a shared folder and grant share permissions **to a user from the `acquired.example` side.**

```powershell
New-Item -Path "C:\CrossForestShare" -ItemType Directory
New-SmbShare -Name "CrossForestShare" -Path "C:\CrossForestShare" -FullAccess "ACQUIRED\Domain Users"
```

**If the trust is working correctly, despite being in a different forest, an account from `acquired.example` (`ACQUIRED\username`) should now be selectable from `example.com`'s share-permission configuration screen.** Confirm you can actually reach `\\DC-CORP\CrossForestShare` from a machine logged on as a user in the `acquired.example` domain.

## The View From the Top 1% Perspective

### What a Trust Solves, and What It Doesn't

At this point, **the problem of "letting authentication cross the boundary" is solved.** But in a real-world corporate acquisition or organizational merger, that's not the end of the story. Typical problems a trust leaves entirely unsolved include:

- **Duplicate user accounts**: If both forests happen to have the same username (`jsmith`, say), a trust alone does nothing to resolve that collision.
- **Final consolidation (retiring one of the two forests)**: A trust is a mechanism for "two organizations cooperating while staying separate" — actually retiring one forest entirely and consolidating every user and group into the other requires a completely different body of work.
- **Migrating while preserving existing access rights**: Simply recreating user accounts from scratch doesn't carry over the access rights (on a file server, say) tied to the old accounts' SIDs.

<details>
<summary>Where ADMT (Active Directory Migration Tool) Actually Stands Today</summary>

For this kind of work — migrating user accounts to a different forest along with their **SID history** (a mechanism that keeps an old account's SID as an attribute of the new account, preserving existing access rights) — Microsoft has traditionally provided a tool called **ADMT** (Active Directory Migration Tool).

That said, if you're considering ADMT for real-world use, **you need an accurate picture of where it stands today.** Development on ADMT has stopped, and Microsoft's own official support policy only covers testing through Windows Server 2012 R2 on both the source and target sides — operation on a current version like Windows Server 2025 hasn't been validated. Combined with the fact that it requires a dedicated SQL Server instance, **the honest answer is that actually running and testing ADMT in the Windows Server 2025 environment this blog's hands-on labs assume isn't something I'd recommend.** For that reason, this article doesn't turn ADMT into a hands-on you actually run — it stops at conveying two facts: **"there's a whole territory beyond a trust that requires a dedicated tool like this," and "that dedicated tool itself is now at a crossroads."** For a real consolidation project, you'd need to research and validate alternatives to ADMT (a third-party migration tool, or identity consolidation on the Microsoft Entra ID side) individually, based on the project's actual requirements.

</details>

## Common Misconceptions and Pitfalls

- **Misconception 1: "AD belonging to the same company automatically gets a trust, even across different forests"**
  Automatic trust relationships only form between domains within the same forest (parent-child, or between tree roots). Independent forests never get a trust relationship unless it's explicitly built with a command like `netdom trust`.
- **Misconception 2: "Building a forest trust means the corporate merger is essentially done"**
  A trust only solves authentication and access-permission cooperation. Resolving duplicate user accounts, or ultimately retiring one of the two forests, requires an entirely separate body of work — potentially a dedicated migration tool.

## The Troubleshooting Perspective

1. **`netdom trust` fails**: Check whether Step 1's DNS resolution (the conditional forwarders) is actually working in both directions. If name resolution fails, building the trust itself fails.
2. **The trust formed, but the other forest's users never show up as an option**: Check the SID filtering configuration, and whether the trust's direction (one-way or two-way) is what you intended.

### Preventive Measures and Permanent Fixes

- Before building a forest trust, always establish two-way DNS name resolution (conditional forwarders) first, and confirm connectivity.
- In a corporate acquisition or organizational-merger project, plan building the trust and actually consolidating users/data (and whether a dedicated tool is needed) as separate phases.

## Summary

- Unlike domains within the same forest, trust between genuinely independent forests (a forest trust) never happens automatically — an administrator has to explicitly build it with a command like `netdom trust`.
- Building a forest trust requires establishing two-way DNS name resolution (conditional forwarders) beforehand.
- A forest trust only solves authentication and access-permission cooperation — resolving duplicate user accounts or final forest consolidation requires separate work.
- ADMT is the traditional dedicated tool for this territory, but development has stopped, and it hasn't been validated on current Windows Server versions.

**What to Keep in Mind From Today**
1. When you hear "it's a different forest," design around the assumption that no trust relationship forms automatically.
2. Treat building a trust (authentication cooperation) and consolidating users/data (a territory that may need a dedicated tool) as separate problems.

## References

- [How Trusts Work | Microsoft Learn](https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/get-started/adac/introduction-to-active-directory-domains-and-trusts)
- [Netdom trust | Microsoft Learn](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/netdom-trust)
- [SID Filtering and Claims Transformation | Microsoft Learn](https://learn.microsoft.com/en-us/windows-server/security/kerberos/sid-filtering-and-claims-transformation)
- [Support policy and known issues for ADMT | Microsoft Learn](https://learn.microsoft.com/en-us/troubleshoot/windows-server/active-directory/support-policy-and-known-issues-for-admt)
