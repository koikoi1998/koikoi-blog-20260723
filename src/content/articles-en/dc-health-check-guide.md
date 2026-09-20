---
title: "Understanding DC Health Checks from a \"Top 1%\" Perspective — Reading repadmin /showrepl and net share"
description: "Every AD migration procedure calls for repadmin /showrepl and net share. What does each command's output actually represent, and by what criteria can it be judged \"healthy\"? This article systematically explains the five partitions visible in repadmin /showrepl, what the C$, IPC$, ADMIN$, NETLOGON, and SYSVOL shares shown by net share mean, and what the SysvolReady registry value indicates."
series: "active-directory"
order: 7
tags: ["windows-server", "active-directory", "infra", "troubleshooting"]
emoji: "🩺"
pubDate: 2026-09-20
---

## Introduction

- **What You'll Learn From This Article**: This article systematically explains what the output of two commands that appear in nearly every AD migration or DC build procedure — `repadmin /showrepl` and `net share` — concretely represents, and the criteria for judging it "healthy." It covers the true identity of the five partitions visible in `repadmin /showrepl`, the meaning of the `C$`, `IPC$`, `ADMIN$`, `NETLOGON`, and `SYSVOL` shares shown by `net share`, and what the `SysvolReady` registry value indicates.
- **Intended Audience**: This article is aimed at engineers who've run `repadmin /showrepl` or `net share` while following an AD migration or DC build procedure, but who've stopped at the surface-level judgment of "no errors showed up, so it must be fine" without understanding what the output actually means.
- **Estimated Reading Time**: About 19 minutes

This article is part of the [Top 1% Series' full article guide](/en/sitemap), and the seventh article in the [Active Directory series](/en/sitemap#series-list). It assumes you understand partition types from [Understanding the Difference Between AD and DC, and Domains vs. Forests, from a "Top 1%" Perspective](/en/articles/ad-dc-fundamentals-guide), and `_msdcs`/`ForestDnsZones` from [Reading DNS Zones and Records from a "Top 1%" Perspective](/en/articles/dns-zones-records-guide).

## Prerequisites

- **Replication**: The mechanism by which AD DS changes are replicated between DCs. See [Understanding the Difference Between AD and DC, and Domains vs. Forests, from a "Top 1%" Perspective](/en/articles/ad-dc-fundamentals-guide) for details.
- **SYSVOL**: A shared folder, replicated between DCs, that holds the actual files for Group Policy Objects (GPOs), logon scripts, and so on.

## Getting the Big Picture

### In a Nutshell

**`repadmin /showrepl` is a command that checks whether the AD DS data itself is being correctly replicated between DCs; `net share` is a command that checks whether that DC is actually able to correctly provide what it's supposed to provide as file shares.** These two check entirely different layers, and confirming DC health requires looking at both together.

```mermaid
graph TB
    subgraph Repadmin["What repadmin /showrepl checks"]
        Data["The AD DS data itself<br/>(domain, configuration, schema, DNS zones)"]
    end
    subgraph NetShare["What net share checks"]
        Shares["Whether it's actually being provided as a file share<br/>(SYSVOL, NETLOGON, and so on)"]
    end
    Repadmin -.different layers of health.-> NetShare
```

## Fundamentals, Explained Thoroughly

### The Five Partitions Shown by `repadmin /showrepl`

Running `repadmin /showrepl` shows, for each of the several partitions (naming contexts) a DC holds, the latest sync status with each of its replication partners. In a typical single-domain forest, you'll see these five partitions:

| Partition | Contents | Replication scope |
|---|---|---|
| Domain partition (e.g. `DC=corp,DC=example,DC=com`) | Objects such as users, computers, and groups | All DCs within the domain |
| Configuration partition (`CN=Configuration,...`) | Forest-wide configuration information such as site topology and replication topology | All DCs in the forest |
| Schema partition (`CN=Schema,CN=Configuration,...`) | Object type definitions | All DCs in the forest |
| DomainDnsZones partition | AD-integrated DNS zone data shared at the domain level | All DCs in the domain (that hold the DNS server role) |
| ForestDnsZones partition | DNS zone data that needs to be shared forest-wide, such as `_msdcs` | All DCs in the forest (that hold the DNS server role) |

These five categories correspond exactly to the three basic partitions (domain, configuration, schema) explained in [Understanding the Difference Between AD and DC, and Domains vs. Forests, from a "Top 1%" Perspective](/en/articles/ad-dc-fundamentals-guide), plus the two DNS-specific partitions (DomainDnsZones and ForestDnsZones) explained in [Reading DNS Zones and Records from a "Top 1%" Perspective](/en/articles/dns-zones-records-guide). **Since each partition has a different replication scope, when isolating a replication inconsistency, it's important to always check which partition the problem is occurring in.**

### What "Success" Actually Means

In the output of `repadmin /showrepl`, information like the following is shown for inbound replication from each partner:

```
DC1\CORP.EXAMPLE.COM
DC Options: IS_GC
Site Options: (none)
DSA object GUID: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
DSA invocationID: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx

==== INBOUND NEIGHBORS ======================================

DC=corp,DC=example,DC=com
    CN=Configuration,DC=corp,DC=example,DC=com
        DC2\CORP.EXAMPLE.COM via RPC
            DSA object GUID: yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy
            Last attempt @ <timestamp> was successful.
```

The most important thing to check here is **whether the most recently attempted replication with each partner reads `was successful`, and whether that timestamp falls within a reasonable window relative to the current time (typically, within the last few hours).** **"Successful" only means that the most recent replication attempt with that partner completed correctly — it doesn't rule out the possibility that replication had been stalled for a long time before that.** Rather than being reassured by looking at just the most recent attempt, you also need to check whether the consecutive failure count is 0, and whether the last-success timestamp isn't abnormally old.

<details>
<summary>What a failure looks like</summary>

When replication is failing, instead of `was successful`, you'll see an error code and its meaning, such as:

```
Last attempt @ <timestamp> failed, result 1722 (0x6ba):
    The RPC server is unavailable.
    <failure count> consecutive failure(s).
Last success @ <timestamp>.
```

**If `<failure count> consecutive failure(s)` is greater than 0, that definitively indicates some kind of problem.** The error code (1722, in this example) indicates that RPC — the communication mechanism between these DCs — is itself unreachable, which is a clue to check for issues with network connectivity, firewalls, or DNS name resolution.

</details>

### The Default Shares Shown by `net share`: C$, IPC$, ADMIN$, NETLOGON, SYSVOL

Running the `net share` command on a DC (or on Windows Server in general) shows, alongside any explicitly created shared folders, the **administrative shares that are automatically set up by default.**

| Share name | What it points to | Purpose |
|---|---|---|
| `C$` | The entire `C:\` drive | An administrative share letting a user with administrator privileges access that entire drive remotely (a similar `D$` and so on is automatically created per drive letter) |
| `ADMIN$` | `%SYSTEMROOT%` (typically `C:\Windows`) | An administrative share used for remote administrative operations (such as installing a service) — many remote management tools rely on it internally |
| `IPC$` | Not a folder with actual content — a named pipe for inter-process communication | A special share used not for file sharing but for carrying inter-process communication such as remote procedure calls (RPC) over SMB. Unlike the other shares, it has no actual file content |
| `NETLOGON` | The `scripts` folder under SYSVOL | A share for distributing logon scripts and the like |
| `SYSVOL`| The entire SYSVOL folder | A share for distributing the actual files of Group Policy Objects (GPOs) |

**Of these, C$, IPC$, and ADMIN$ aren't specific to AD DS or DCs at all — they're administrative shares always created by default on any ordinary Windows (Server) machine.** **NETLOGON and SYSVOL, on the other hand, are proof that the server is functioning correctly as a DC**, and hold particular significance for DC health checks.

### Why the Presence of NETLOGON and SYSVOL Shares Constitutes a DC Health Check

The NETLOGON and SYSVOL shares are only automatically created once replication of the SYSVOL folder (via DFSR, or the legacy FRS) has completed successfully, and the Netlogon service has judged its content ready to distribute. **Right after promoting a DC, or when there's a problem with SYSVOL replication, these two shares may not exist (or may temporarily disappear).** If running `net share` doesn't show these two shares, that DC likely can't apply Group Policy or distribute logon scripts, and in practice, should be judged as not fully functioning as a DC.

A command that makes this judgment more reliable is checking a registry value with `reg query`:

```powershell
reg query "HKLM\SYSTEM\CurrentControlSet\Services\Netlogon\Parameters" /v SysvolReady
```

This registry value, `SysvolReady`, **is set to `1` by the Netlogon service once it judges that SYSVOL replication has completed and it's safe to start sharing.** Beyond eyeballing the output of `net share`, confirming this value is `1` lets you more reliably distinguish "the share is just temporarily not showing" from "replication genuinely hasn't finished yet."

## The View From the Top 1% Perspective

### Confirming No Trace of a Demoted DC Remains

In real AD migration work, after formally demoting and removing a DC, you need to confirm **that no trace of that DC remains anywhere in AD DS.** From `repadmin`'s perspective, this is confirmed with commands like:

```powershell
repadmin /replsummary
repadmin /showrepl *
```

If the output of these commands **still lists the name of an old DC that should already have been removed, as a replication partner, that means the demotion process wasn't complete, and stale references (metadata) still remain in AD DS.** This is a clear sign of impaired health, and along with confirming that any leftover SRV and GUID records in the `_msdcs` zone (covered in [Reading DNS Zones and Records from a "Top 1%" Perspective](/en/articles/dns-zones-records-guide)) have been cleaned up, it should be treated as a criterion for judging whether an AD migration is truly complete. Confirming the actual object-level removal in AD DS (cleanup via `dsa.msc`, `adsiedit.msc`, and so on) will be covered in a later article.

### Thoroughly Checking Across Multiple DCs and Partners

`repadmin /showrepl` shows the state of inbound replication with the running DC itself as the receiver. **In an environment with multiple DCs, it's important not to stop at checking just one — run this command on each DC and confirm that replication is functioning correctly across every combination of DCs.** `repadmin /replsummary` lets you get a consolidated overview of failing replication across every DC in the forest in one view, which helps make health checks efficient in large-scale environments.

## Common Misconceptions and Pitfalls

- **Misconception 1: "If repadmin /showrepl shows no errors, AD DS is fully healthy"**
  `repadmin /showrepl` only checks the replication status of AD DS's data. SYSVOL's share status (what `net share` confirms) is a different layer of health entirely — both need to be checked together.
- **Misconception 2: "Once the NETLOGON and SYSVOL shares have shown up once, there's no need to check again"**
  If a problem develops in SYSVOL replication later on, the share itself may still remain even while replication of its content (such as GPO files) has stalled. Beyond the mere existence of the shares, the actual health of the replicated content needs to be checked continuously.
- **Misconception 3: "C$ and ADMIN$ are dangerous shares specific to AD environments, and should be disabled on DCs"**
  C$, IPC$, and ADMIN$ aren't specific to AD DS at all — they're administrative shares created by default across all of Windows Server. Disabling them breaks many remote management tools, so the standard practice is to protect them through access control (who holds administrator privileges) rather than disabling them.

## The Troubleshooting Perspective

The basic approach to DC health checks is to **check both layers together: "replication of AD DS data" (repadmin) and "SYSVOL's sharing and replication" (net share/SysvolReady).**

1. **Replication is failing between specific DCs**: Check the error code in `repadmin /showrepl` to isolate whether the problem is RPC reachability, DNS name resolution, or a firewall.
2. **Group Policy isn't being applied on a specific DC**: Run `net share` on that DC to check whether the NETLOGON and SYSVOL shares exist. If they don't, check the `SysvolReady` registry value and the state of the SYSVOL replication (DFSR) service.
3. **After an AD migration, information about an old DC that should have been removed still remains**: Use `repadmin /replsummary` or `repadmin /showrepl *` to check whether the old DC's name still shows up as a replication partner.

### Preventive Measures and Permanent Fixes

- In environments with multiple DCs, periodically run `repadmin /replsummary` to monitor replication status across the whole forest at a glance.
- Right after building and promoting a new DC, confirm SYSVOL sharing has started using both `net share` and `SysvolReady` before putting it into production use (adding it as a reference target for clients).
- When demoting and removing a DC, treat confirming that the old DC's name has completely disappeared from `repadmin`'s output as the criterion for considering the work complete.

## Summary

- `repadmin /showrepl` checks the replication status of the AD DS data itself, while `net share` checks whether things like SYSVOL are actually being provided as file shares — the two check different layers of health.
- The five partitions visible in `repadmin /showrepl` are the three basic partitions (domain, configuration, schema) plus the two DNS-specific ones (DomainDnsZones and ForestDnsZones).
- A "successful" indicator only means the most recent attempt succeeded — you also need to check the failure count and the last-success timestamp.
- The NETLOGON and SYSVOL shares are proof that SYSVOL replication has completed, and checking them together with the `SysvolReady` registry value lets you judge DC health more reliably.

**What to Keep in Mind From Today**
1. When looking at `repadmin /showrepl`'s output, check the failure count and the last-success timestamp, not just the "successful" indicator.
2. After demoting and removing a DC during an AD migration, confirm its name has completely disappeared from `repadmin /replsummary` before considering the work complete.

## References

- [Repadmin overview | Microsoft Learn](https://learn.microsoft.com/en-us/troubleshoot/windows-server/identity/repadmin-overview)
- [Monitoring and Troubleshooting Active Directory Replication Using Repadmin | Microsoft Learn](https://learn.microsoft.com/en-us/troubleshoot/windows-server/identity/useful-repadmin-commands)
- [Understanding SYSVOL Replication | Microsoft Learn](https://learn.microsoft.com/en-us/windows-server/storage/dfs-replication/migrate-sysvol-to-dfsr)
- [Overview of problems that are caused by disabling NTLM or administrative shares | Microsoft Learn](https://learn.microsoft.com/en-us/troubleshoot/windows-server/networking/disable-administrative-shares)
