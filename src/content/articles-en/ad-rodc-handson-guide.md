---
title: "The Top 1% Hands-On for Deploying a Branch-Office RODC (Read-Only Domain Controller)"
description: "Build an RODC (Read-Only Domain Controller), designed for branch offices where physical security can't be guaranteed. Covers the Password Replication Policy (PRP), which caches no user's password by default, and why the blast radius stays limited if an RODC is ever physically stolen."
series: "active-directory"
subSeries: "handson"
order: 38
tags: ["windows-server", "active-directory", "infra", "handson", "security", "branch-office"]
emoji: "🏢"
pubDate: 2026-09-26
---

## Introduction

- **What You'll Learn From This Article**: You'll build an **RODC (Read-Only Domain Controller)**, designed to solve a common real-world headache — needing to place a DC at a branch office where the server room doesn't lock, or physical security simply can't be guaranteed. You'll experience the **Password Replication Policy (PRP)**, which caches no user's password by default, and understand why the blast radius stays limited even if an RODC is ever physically stolen.
- **Intended Audience**: Readers who've only heard "branch offices get an RODC" as a convention, without understanding what actually differs from a normal DC.
- **Estimated Reading Time**: About 20 minutes (about 45 minutes if you build along with the hands-on)

This article is part of the [Top 1% Series Complete Article Guide](/en/sitemap), the 38th article in the [Active Directory Series](/en/sitemap#series-list).

## Prerequisites

- [The Difference Between AD, DCs, Domains, and Forests](/en/articles/ad-dc-fundamentals-guide): This article assumes you already know what a normal DC's role is.

## Why an RODC Is Needed in the First Place

A normal DC holds a full, writable copy of the entire AD DS database. That's not a problem in an environment like a data center, where physical access is tightly controlled. But it's not unusual at all for a branch office or a factory floor to lack a lockable server room, with anyone able to walk up to the server rack. **If a normal DC is placed at a location like this and stolen, the stolen disk contains a full copy of AD DS — including the password hashes of every user in the entire forest.** An RODC is a special kind of DC, designed specifically to absorb this physical risk.

## The Big Picture

This hands-on consists of three steps.

```mermaid
graph LR
    Step1["Step1<br/>Promote it as an RODC"]
    Step2["Step2<br/>Configure the Password<br/>Replication Policy"]
    Step3["Step3<br/>Confirm the caching<br/>behavior firsthand"]
    Step1 --> Step2 --> Step3
```

## Hands-On Steps

### Step 1: Promote it as an RODC

Promote a new server as an RODC, instead of a normal DC.

```powershell
Install-ADDSDomainController -DomainName "example.com" -ReadOnlyReplica -SiteName "BranchOffice" -InstallDns
```

**The `-ReadOnlyReplica` option is the single, decisive difference from a normal DC promotion.** Once promotion completes, this RODC holds a read-only copy of the AD DS database.

### Step 2: Configure the Password Replication Policy

Right after an RODC is promoted, **it caches no user's password at all, by default.** This means every time a user at the branch logs in, the RODC forwards that authentication to a writable DC — at headquarters, say — every single time. That would leave branch users unable to log in whenever the WAN link drops, so you configure explicit permission, scoped to just the branch's own users.

```powershell
$rodc = Get-ADDomainController -Identity "RODC-Branch01"
Add-ADDomainControllerPasswordReplicationPolicy -Identity $rodc -AllowedList "BranchOfficeUsers"
```

**The single most important point here is that the default is "deny everything," made explicitly opt-in.** Only users belonging to the `BranchOfficeUsers` group are permitted to have their passwords cached on this RODC. Any other user — headquarters executives' accounts, say — will never have their password cached on this RODC, even if they log in at this branch.

### Step 3: Confirm the caching behavior firsthand

Log in from this branch as a user belonging to `BranchOfficeUsers`. After the first login, confirm the password was actually cached with this command.

```powershell
Get-ADDomainControllerPasswordReplicationPolicyUsage -Identity "RODC-Branch01" -Cached
```

Next, try logging in the same way as a different user who isn't included in `BranchOfficeUsers`. The login itself succeeds (since the RODC forwards authentication to a writable DC), but running the same command as before confirms **this user's password was never cached.**

## What a Pro Sees Here (Top 1% Understanding)

### If an RODC is stolen, what's actually at risk is "only the passwords that were cached"

Consider the response procedure if an RODC is ever physically stolen. The administrator checks the list of "passwords that were cached on this RODC," which appears when deleting that RODC's object from `dsa.msc`, and **resets, in bulk, only the passwords for the accounts on that list.** **Had this been the theft of a normal DC instead, a far larger response would have been required — resetting the password of every single account in the forest.** The Password Replication Policy's design of limiting the blast radius to just that branch's users is the single biggest value an RODC provides.

### An RODC's other face: Administrator Role Separation

An RODC has one more important feature beyond controlling password caching: **Administrator Role Separation.** It's a common scenario to want to permit a branch's IT staffer to do local admin work on that RODC — rebooting it, applying patches — without handing them Domain Admins rights that affect the entire forest. An RODC lets you designate an ordinary AD DS user as the local administrator for just that one RODC. **This user can administer that RODC at the OS level, but has no rights over AD DS's data itself, at all.** This is another concrete instance of the principle of least privilege, covered in [The Top 1% Hands-On for Delegating OU Control to the Help Desk](/en/articles/ad-delegation-handson-guide).

## Common Misconceptions and Pitfalls

- **Misconception 1: "An RODC rejects every kind of write operation against AD DS."**
  What an RODC rejects is a direct write to the AD DS database. It does accept a password change request — it's just forwarded to a writable DC for processing.
- **Misconception 2: "An RODC caches every user's password by default, just like a normal DC."**
  An RODC caches no user's password by default. Only explicitly permitted users are ever cached.
- **Misconception 3: "Configuring Administrator Role Separation on an RODC makes that user an administrator of the entire domain."**
  The rights granted by Administrator Role Separation are limited to local administration of that one specific RODC.

## Troubleshooting Perspective

1. **Branch users can't log in when the WAN link drops**: Check whether that user is on the Password Replication Policy's allowed list, and whether their password was already cached from a prior login.
2. **A user you expected to be cached isn't**: Check whether the correct group or user was actually specified as the target of `Add-ADDomainControllerPasswordReplicationPolicy`.
3. **The RODC promotion itself fails**: Check whether the forest functional level requirement is met, and whether at least one writable Windows Server 2008-or-later DC exists in the forest.

## Summary

- An RODC is a read-only DC, designed for branch offices where physical security can't be guaranteed.
- The Password Replication Policy denies everything by default — only explicitly permitted users' passwords get cached.
- If an RODC is stolen, the blast radius is limited to only the users whose passwords were cached there.
- Administrator Role Separation lets you delegate local admin rights over just that one RODC, without handing out domain-wide rights.

**Takeaways to Apply Today**
1. Whenever you need to place a DC somewhere physical security can't be guaranteed, consider whether an RODC solves it.
2. Keep the Password Replication Policy's allowed list scoped to only the users and groups that genuinely need it.

## References

- [RODC Administration and Password Replication Policy | Microsoft Learn](https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/plan/planning-considerations-for-rodc-deployment)
- [Delegated Administration for RODCs | Microsoft Learn](https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/deploy/deploying-a-rodc-delegating-administrative-permissions)
