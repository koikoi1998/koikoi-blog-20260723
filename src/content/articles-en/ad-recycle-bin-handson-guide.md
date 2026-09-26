---
title: "The Top 1% Hands-On for Restoring an Accidentally Deleted User or OU: Enabling and Using the AD Recycle Bin"
description: "Enable the AD Recycle Bin, deliberately delete an entire OU including a user, and restore it with group memberships and other attributes fully intact. This hands-on covers why the AD Recycle Bin is disabled by default, why enabling it is irreversible, and how it differs from the older tombstone-based restore method."
series: "active-directory"
subSeries: "handson"
order: 25
tags: ["windows-server", "active-directory", "infra", "identity", "handson", "backup"]
emoji: "🗑️"
pubDate: 2026-09-26
---

## Introduction

- **What you'll get from this article**: This hands-on simulates a real-world AD operations accident — "I accidentally deleted an entire OU, including a user" — and walks you through **enabling the AD Recycle Bin and restoring the deleted objects with attributes like group membership fully intact.** Along the way, we'll cover why the AD Recycle Bin is disabled by default, why enabling it is an irreversible operation, and how it differs from the restore methods used before the AD Recycle Bin existed.
- **Intended audience**: Readers who work with AD operations but have never actually practiced the recovery procedure for an accidental deletion, and want to be prepared rather than panicked when it happens.
- **Estimated reading time**: About 20 minutes (about an hour if you build along with the hands-on)

This article is part of the [Top 1% Series Complete Article Guide](/en/sitemap), the 25th article in the [Active Directory Series](/en/sitemap#series-list). If you already have a DC/domain environment (such as one built in [Hands-On: Building a Multi-Domain, Multi-Tree AD Forest](/en/articles/ad-multidomain-handson-guide)), you can use it as-is for this exercise.

## Prerequisites

- **Forest functional level**: Enabling the AD Recycle Bin requires the forest functional level to be Windows Server 2008 R2 or higher. See [The Difference Between AD, DCs, Domains, and Forests](/en/articles/ad-dc-fundamentals-guide) for details.

## The Big Picture

This hands-on consists of four steps.

```mermaid
graph LR
    Step1["Step1<br/>Enable the AD Recycle Bin"]
    Step2["Step2<br/>Create a test OU, user,<br/>and group"]
    Step3["Step3<br/>Deliberately delete the OU"]
    Step4["Step4<br/>Restore with attributes intact"]
    Step1 --> Step2 --> Step3 --> Step4
```

## Hands-On Steps

### Step 1: Enable the AD Recycle Bin

Enable the AD Recycle Bin feature with PowerShell.

```powershell
Enable-ADOptionalFeature -Identity 'Recycle Bin Feature' `
    -Scope ForestOrConfigurationSet -Target <forest root domain name> -Confirm:$false
```

**When you run this command, you'll see a confirmation prompt warning that this operation cannot be undone. That's literally true: once you enable the AD Recycle Bin, it can never be disabled again.** We strongly recommend trying this in a test environment rather than production.

### Step 2: Create a test OU, user, and group

Create a test OU, a user inside it, and a group that the user belongs to.

```powershell
New-ADOrganizationalUnit -Name "TestOU" -Path "DC=example,DC=com" -ProtectedFromAccidentalDeletion $false
New-ADUser -Name "testuser1" -Path "OU=TestOU,DC=example,DC=com" -Enabled $true -AccountPassword (ConvertTo-SecureString "P@ssw0rd123!" -AsPlainText -Force)
New-ADGroup -Name "TestGroup" -Path "OU=TestOU,DC=example,DC=com" -GroupScope Global
Add-ADGroupMember -Identity "TestGroup" -Members "testuser1"
```

**Note the explicit `-ProtectedFromAccidentalDeletion $false`.** An OU created through ADUC has the "Protect object from accidental deletion" checkbox enabled by default, which would cause the deletion in the next step to be rejected outright. Here we're deliberately removing that protection so the deletion can actually go through.

### Step 3: Deliberately delete the entire OU

Delete the OU you just created, along with the user and group inside it.

```powershell
Remove-ADOrganizationalUnit -Identity "OU=TestOU,DC=example,DC=com" -Recursive -Confirm:$false
```

Running `Get-ADUser -Identity testuser1` should now return an "object not found" error. **This reproduces the real-world accident.**

### Step 4: Restore with attributes intact

The deleted objects haven't actually vanished completely — they remain inside AD DS as **deleted objects** for a set period (180 days by default). First, find and restore the OU itself.

```powershell
Get-ADObject -Filter 'isDeleted -eq $true' -IncludeDeletedObjects |
    Where-Object { $_.Name -like "TestOU*" } |
    Restore-ADObject
```

Once the OU is restored, restore the user and group that were inside it the same way.

```powershell
Get-ADObject -Filter 'isDeleted -eq $true' -IncludeDeletedObjects |
    Where-Object { $_.Name -like "testuser1*" -or $_.Name -like "TestGroup*" } |
    Restore-ADObject
```

Run `Get-ADUser -Identity testuser1 -Properties MemberOf` and confirm that **`testuser1` has been restored with its original `TestGroup` membership intact.** This is the single biggest value the AD Recycle Bin provides: it's not just the user account itself that comes back, but related attributes like group membership are restored exactly as they were at the moment of deletion.

## What a Pro Sees Here (Top 1% Understanding)

### How restoration worked before the AD Recycle Bin existed

Before the AD Recycle Bin (introduced in Windows Server 2008 R2), a deleted object survived only as a **tombstone**, with most of its attributes stripped away. Restoring it required taking a DC temporarily offline and performing an **authoritative restore** using `ntdsutil` — a far more labor-intensive process. Worse, this method could not restore **linked attributes that reference the deleted object from the other side, such as group membership.** What made the AD Recycle Bin groundbreaking was that it retains deleted objects with nearly all of their attributes intact, for far longer than a tombstone, and lets you restore them with a single command from any domain-joined server.

### Why is the AD Recycle Bin disabled by default?

Enabling the AD Recycle Bin means **deleted objects remain inside AD DS, retaining nearly as much information as a live object, for the same period as the default `tombstoneLifetime` (180 days by default).** This translates directly into a larger AD DS database and increased replication traffic between DCs. This is rarely an issue in small environments, but it's a real design consideration in large environments with frequent, high-volume object creation and deletion. That said, weighed against how often recovery from accidental deletion is actually needed in practice, and how much work it saves when it is, **enabling it is now strongly recommended for almost every environment.**

## Common Misconceptions and Pitfalls

- **Misconception 1: "The AD Recycle Bin is enabled by default on Windows Server."**
  It is disabled by default. An administrator must explicitly enable it with `Enable-ADOptionalFeature`.
- **Misconception 2: "You can disable the AD Recycle Bin later if you no longer need it."**
  Enabling the AD Recycle Bin is irreversible — once enabled, it can never be disabled.
- **Misconception 3: "After restoring a deleted user, you have to manually re-add them to the groups they used to belong to."**
  When restored via the AD Recycle Bin, group memberships and nearly all other attributes are restored exactly as they were at deletion time.

## Troubleshooting Perspective

1. **`Enable-ADOptionalFeature` fails**: Check whether the forest functional level is Windows Server 2008 R2 or higher.
2. **`Restore-ADObject` succeeds, but the object doesn't end up in its original location**: Check whether the deleted object's original parent container (the OU, in this case) has itself been restored first. If the parent hasn't been restored, child objects may be restored into a default container such as `LostAndFound`.
3. **An object deleted more than 180 days ago can't be found**: Once the default retention period (`tombstoneLifetime`, 180 days by default) has passed, deleted objects are permanently purged. If you notice an accidental deletion, restore it as soon as possible.

### Prevention and Permanent Countermeasures

- In production, enable the AD Recycle Bin as early as possible (while the environment is still small).
- Keep `-ProtectedFromAccidentalDeletion $true` (the default) on important OUs to prevent accidental deletion in the first place.
- If you notice an accidental deletion, restore it as soon as possible, before `tombstoneLifetime` runs out.

## Summary

- The AD Recycle Bin is disabled by default and must be explicitly enabled with `Enable-ADOptionalFeature`. This is an irreversible operation.
- Deleted objects can be found with `Get-ADObject -IncludeDeletedObjects` and restored with `Restore-ADObject`.
- Restoring via the AD Recycle Bin brings back related attributes, such as group membership, exactly as they were at the time of deletion.
- The older tombstone-based restore method was far more labor-intensive and could not restore related attributes.

**Takeaways to apply today**
1. If you find an environment where the AD Recycle Bin isn't yet enabled, consider enabling it soon (keeping in mind that it's irreversible).
2. When you notice an accidental deletion, remember to restore the parent container first, then its children.

## References

- [Active Directory Recycle Bin: Understanding, Implementing, Best Practices | Microsoft Learn](https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/get-started/adac/introduction-to-active-directory-administrative-center-enhancements--level-100-)
- [Restore-ADObject | Microsoft Learn](https://learn.microsoft.com/en-us/powershell/module/activedirectory/restore-adobject)
