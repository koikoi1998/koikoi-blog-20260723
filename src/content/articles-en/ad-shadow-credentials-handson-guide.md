---
title: "A Top 1% Hands-On: Reproducing the Shadow Credentials Attack Abusing msDS-KeyCredentialLink Yourself — Impersonating a Target Without Ever Knowing Its Password"
description: "The RBCD Hands-On covered how write permission on a target (like GenericWrite) alone, with no domain admin privilege at all, lets you configure delegation. The Shadow Credentials attack uses that exact same write permission to register an attacker-controlled key pair into msDS-KeyCredentialLink, the attribute Windows Hello for Business relies on. Without ever changing or even knowing the target's password, impersonate it via PKINIT and even recover its NT hash — reproduce this quiet attack technique yourself."
series: "active-directory"
subSeries: "handson"
order: 43.3
tags: ["windows-server", "active-directory", "infra", "handson", "security"]
emoji: "👤"
pubDate: 2026-12-12
---

## Introduction

- **What You'll Learn From This Article**: You'll get hands-on and systematically understand the **Shadow Credentials attack** — a new variation on abusing write permission to a target, covered in the [RBCD Hands-On](/en/articles/ad-rbcd-handson-guide).
- **Intended Audience**: Readers who want to learn one more concrete attack that a write permission like GenericWrite actually enables.
- **Estimated Reading Time**: About 25 minutes (budget about 40 minutes if you're building this hands-on as you go)
- **This hands-on is for auditing and defensive purposes, to strengthen your own organization's environment.**

This article is part of the [Top 1% Series Complete Article Guide](/en/sitemap), and article 43.3 in the [Active Directory Series](/en/sitemap#series-list).

## Prerequisite Knowledge

- [RBCD Hands-On](/en/articles/ad-rbcd-handson-guide): Understanding the attack pattern of abusing a write permission like GenericWrite/GenericAll is a prerequisite.
- [AD CS Hands-On](/en/articles/ad-cs-handson-guide): A basic understanding of AD CS, the prerequisite behind PKINIT (certificate-based Kerberos authentication), is a prerequisite.

## Getting the Big Picture

**`msDS-KeyCredentialLink` is an attribute stored on a user or computer object, supporting certificate-based passwordless authentication (PKINIT), like Windows Hello for Business.** **With just write permission on this attribute (GenericWrite, GenericAll, and similar), an attacker can register a key pair they themselves control into it, without ever needing to know the target's password at all.** **Authenticate via PKINIT using that key, and the attacker can impersonate the target, even recovering its NT hash.**

```mermaid
sequenceDiagram
    participant Attacker as Attacker
    participant AD as msDS-KeyCredentialLink
    participant KDC as KDC (PKINIT)
    Attacker->>Attacker: Generate their own key pair
    Attacker->>AD: Register the public key into the target's msDS-KeyCredentialLink, using write permission
    Attacker->>KDC: Authenticate as the target via PKINIT, using their own private key
    KDC->>Attacker: Issues a TGT; the NT hash can also be recovered
```

## Deep Dive Into the Fundamentals

### Why There's Never Any Need to Know the Password

**Ordinary Kerberos authentication uses a key derived from the password, but PKINIT is an entirely different authentication method, using public-key cryptography.** **If you can register your own public key into `msDS-KeyCredentialLink`, you can authenticate via PKINIT using only your own private key, completely independent of whatever the target's actual password is.** **This means an attacker never needs to change, or even know, the target's password at all.**

### The Attack Requires AD CS's PKINIT Prerequisite

**For this attack to succeed, the domain controller needs a server authentication certificate that allows Kerberos authentication via PKINIT.** **In many environments, this certificate gets issued by [AD CS (Active Directory Certificate Services)](/en/articles/ad-cs-handson-guide), which is a prerequisite for the Key Trust authentication method.**

<details>
<summary>Why This Attack Is a "Quiet" One</summary>

**Many organizations don't include changes to the `msDS-KeyCredentialLink` attribute in their monitoring scope at all.** **Compared to well-known attack techniques like DCSync or Kerberoasting, detection for changes to this attribute is often simply not in place, making this attack easy to overlook.**

</details>

## What a Pro Sees Here (Top 1% Understanding)

### "Write Permission," One Single Premise, Becomes the Entry Point for Multiple Different Attacks

**[RBCD](/en/articles/ad-rbcd-handson-guide) and this Shadow Credentials attack both rest on the exact same underlying premise: "write permission on the target object."** **The specific steps of each attack differ, but inventorying "who holds write permission on which object" is a shared defensive starting point against multiple different attack techniques.** **The habit of identifying the more fundamental premise an attack abuses, instead of addressing each specific attack technique in isolation,** is the perspective a top-1% engineer carries.

## Common Misconceptions and Pitfalls

- **Misconception 1: "Changing the target's password prevents this attack."**
  This attack succeeds completely independent of the password, so changing it alone never invalidates the key an attacker already registered.
- **Misconception 2: "Changes to msDS-KeyCredentialLink get monitored by default."**
  Many organizations never include changes to this attribute in their monitoring scope, which makes this attack easy to overlook.
- **Misconception 3: "This attack works even in an environment with no AD CS at all."**
  PKINIT authentication requires a server authentication certificate, and in many environments that certificate is issued by AD CS, making AD CS's presence a real prerequisite.

## Troubleshooting Perspective

1. **You want to investigate suspicious PKINIT authentication for a specific account**: Check whether that account's `msDS-KeyCredentialLink` attribute contains an unrecognized key.
2. **You want to invalidate a key an attacker registered**: Remove the relevant key from `msDS-KeyCredentialLink`, carefully, so you don't accidentally remove a legitimate Windows Hello for Business enrollment.
3. **You want to assess your own environment's resilience against this attack**: Inventory, from the ACLs, who holds write permission on which object's `msDS-KeyCredentialLink`.

## Summary

- The Shadow Credentials attack abuses write permission on the `msDS-KeyCredentialLink` attribute to impersonate a target via PKINIT, without ever knowing its password.
- This attack requires the domain controller to have a server authentication certificate for PKINIT, and in many environments AD CS is the prerequisite behind that.
- Many organizations don't include changes to this attribute in their monitoring scope, making it a quiet attack technique that's easy to overlook.
- RBCD and this attack both abuse the same underlying premise: write permission on the target object.

**Takeaways to Apply Today**
1. Include changes to important accounts' `msDS-KeyCredentialLink` attribute in your monitoring scope.
2. Treat inventorying who holds write permission on which object as a shared defense against multiple attack techniques.

## References

- [Shadow Credentials | HackTricks](https://book.hacktricks.xyz/windows-hardening/active-directory-methodology/acl-persistence-abuse/shadow-credentials)
- [Shadow Credentials | ired.team](https://www.ired.team/offensive-security-experiments/active-directory-kerberos-abuse/shadow-credentials)
