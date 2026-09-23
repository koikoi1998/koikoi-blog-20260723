---
title: "Understanding Kerberos Authentication from a \"Top 1%\" Perspective — Why It Can Verify Your Identity Without Ever Sending Your Password Over the Network"
description: "Why can Kerberos authentication verify a user's identity without ever transmitting the password itself over the network? This article systematically explains what pre-authentication, the TGT, and the service ticket exchange (AS-REQ/AS-REP, TGS-REQ/TGS-REP, AP-REQ) actually prove. It also covers the relationship between the PAC (Privilege Attribute Certificate) embedded in tickets and SIDs, the difference from NTLM, and the token-bloat problem."
series: "active-directory"
subSeries: "supplementary"
order: 13
tags: ["windows-server", "active-directory", "kerberos", "sid", "infra", "identity"]
emoji: "🎫"
pubDate: 2026-09-22
---

## Introduction

- **What You'll Learn From This Article**: **Kerberos authentication** — assumed as background throughout [Understanding Windows Logon and User Profiles](/en/articles/ad-windows-login-guide) and [Understanding SPNs (Service Principal Names)](/en/articles/ad-spn-guide) — gets a thorough explanation of its underlying mechanics here. In particular, this article unpacks the core question of "how can identity be verified without ever sending the user's password itself over the network," by walking through the actual message exchanges (AS-REQ/AS-REP, TGS-REQ/TGS-REP, AP-REQ). It also covers the contents of the **PAC (Privilege Attribute Certificate)** embedded in tickets and its relationship to **SIDs**, the difference from NTLM authentication, and the real-world "token bloat" problem that destabilizes logon for users in too many groups.
- **Intended Audience**: This article is aimed at readers who've heard the term "Kerberos authentication" many times but can't explain the concrete mechanics behind "it authenticates without sending the password," as well as readers who want to understand how SIDs are actually used in real authentication and authorization processing.
- **Estimated Reading Time**: About 22 minutes

This article is part of the [Top 1% Series' full article guide](/en/sitemap), and the thirteenth article in the [Active Directory series](/en/sitemap#series-list). Reading [Understanding Windows Logon and User Profiles](/en/articles/ad-windows-login-guide) and [Understanding SPNs (Service Principal Names)](/en/articles/ad-spn-guide) first will make this article easier to follow.

## Prerequisites

- **Symmetric-key encryption**: A cryptographic scheme where the same key is used for both encryption and decryption. Kerberos's foundation rests on symmetric-key encryption. See [Understanding Symmetric Encryption (AES) and HMAC/AEAD](/en/articles/symmetric-encryption-guide) for the mechanics of the scheme itself.
- **The KDC (Key Distribution Center)**: A role a DC also holds, serving as the central server for Kerberos authentication. Internally, it splits into two logical roles: the **AS (Authentication Service)** and the **TGS (Ticket Granting Service)**.
- **SPN**: An identifier that points at the account running a service. See [Understanding SPNs (Service Principal Names)](/en/articles/ad-spn-guide) for details.

## Getting the Big Picture

### In a Nutshell

**The core of Kerberos authentication rests on the assumption that a client and the KDC can each independently derive the same key from the user's password — and what gets exchanged isn't the password itself, but only "proof of holding that key."** The client hashes the password the user entered, on the spot, to derive a key, and sends information encrypted with that key to the KDC. Because the KDC also holds that same user's password hash on the AD DS side, it can independently derive the identical key — and **the very fact that it can correctly decrypt what it received is itself the proof that "this client knows the correct password."** The password hash value itself never travels over the network at all.

```mermaid
sequenceDiagram
    participant Client as Client
    participant KDC as KDC (AS + TGS)
    participant Server as Service

    Note over Client,KDC: Both sides can independently derive the same key from the user's password
    Client->>KDC: ① AS-REQ (username + a timestamp encrypted with that key)
    Note over KDC: Attempts to decrypt with the same key; success means it's the real user
    KDC-->>Client: TGT (encrypted with the KDC's own key — the client can't read its contents)
    Client->>KDC: ② TGS-REQ (TGT + target SPN)
    KDC-->>Client: A service ticket (encrypted with the target service's key)
    Client->>Server: ③ AP-REQ (presents the service ticket)
    Note over Server: Attempts to decrypt using its own key (derived from its password)
    Server-->>Client: Authentication succeeds if decryption works and the contents are valid
```

## Fundamentals, Explained Thoroughly

### Why Pre-Authentication Proves Knowledge of the Password

In the first exchange (① AS-REQ), the client sends the KDC, as pre-authentication data, **the current timestamp encrypted with a key derived from the user's password hash.** The password itself is never included anywhere in this.

The KDC derives the same key, by the same procedure, from that user's password hash stored in AD DS, and attempts to decrypt the timestamp it received. **Only a client that actually knows the correct password can encrypt the timestamp in a form the KDC can decrypt**, so successfully decrypting it is itself the proof of identity. A timestamp is used specifically to prevent a replay attack — reusing stolen encrypted data — which is exactly why Kerberos environments are strict about time synchronization (the default tolerance for clock drift is 5 minutes).

<details>
<summary>What this key actually is: its relationship to the NTLM hash</summary>

In implementation, the key used in Kerberos pre-authentication is, in many cases, derived from the user password's NTLM hash (or an AES-based key, when using newer encryption schemes). What matters here is that **while the plaintext password the user typed is used momentarily in memory on the client side to derive this key, it's never transmitted over the network at all.** This design structurally eliminates the risk of the password or its hash being stolen, even if the communication path itself is eavesdropped on.

</details>

### The True Identity of the TGT (Ticket-Granting Ticket)

Once pre-authentication succeeds, the KDC issues a **TGT** (Ticket-Granting Ticket) to the client. What matters here is that **the TGT is encrypted with the KDC's own key** (derived from the password of a special account called `krbtgt`), which means the client itself can't decrypt and read the TGT's contents. To the client, the TGT is like **a sealed piece of evidence whose contents it can't see, but which it can present to the KDC the next time it requests a service ticket, to prove "I've already been authenticated."**

Alongside the authenticated user's account information, the TGT also contains a **session key** — a temporary key valid only for this authentication session, used to encrypt exchanges involving this TGT. The client decrypts and extracts just this session key using its own key, and holds onto it.

### TGS-REQ/TGS-REP and Obtaining a Service Ticket

When a client wants to access a specific service, it sends a **TGS-REQ** to the KDC, along with the TGT and the target SPN. As covered in [Understanding SPNs (Service Principal Names)](/en/articles/ad-spn-guide), the KDC searches for the account whose `servicePrincipalName` attribute holds this SPN, and issues **a service ticket encrypted with that account's key.** This service ticket also comes with its own dedicated session key.

### AP-REQ and Verification on the Service Side

Finally, the client presents the service ticket it obtained to the service itself, as an **AP-REQ**. The service attempts to decrypt this ticket using **the key derived from its own password** — the same key the KDC used to encrypt it in the TGS-REP. If decryption succeeds and the contents (expiration, client information, and so on) are valid, authentication is established. **The key design point that underpins Kerberos's efficiency is that the service side can verify the ticket's validity using only its own key, without ever querying the KDC directly.**

### The Relationship Between the PAC (Privilege Attribute Certificate) and SIDs

Everything covered so far handles "authentication" — confirming this user really is who they claim to be — but it's missing the information needed for "authorization" — what this user is actually allowed to do. This authorization information is carried by a data structure embedded in the TGT and service tickets called the **PAC** (Privilege Attribute Certificate).

The PAC contains **the user's own SID (Security Identifier), along with the SIDs of every group that user belongs to.** By simply extracting the PAC from a presented ticket, the service side can determine "who this user is and which groups they belong to" **without querying AD DS every time.** This is the concrete, implementation-level reality behind the principle mentioned as a prerequisite in [Understanding Windows Logon and User Profiles](/en/articles/ad-windows-login-guide) — that "Windows's permission management is based on the SID, not on the username string." What a file or folder's access permissions (an ACL) actually check against isn't the username string at all — it's **the list of SIDs contained in the ticket's PAC.**

## The View From the Top 1% Perspective

### The Difference Between Kerberos and NTLM Authentication

| | Kerberos | NTLM |
|---|---|---|
| Authentication method | Ticket-based (presenting a certificate issued by the KDC) | Challenge-response (the server issues a challenge, and the client responds using the password hash) |
| Querying the DC every time | The service side can complete verification just by validating the ticket, without querying the DC each time | The server needs to check with the DC on every single authentication (pass-through authentication) |
| Mutual authentication | Possible (the service can also prove its own legitimacy to the client) | One-directional only (there's no mechanism for the client to verify the server) |
| Delegation (double-hop authentication) | Possible (if delegation is configured) | Fundamentally not possible |
| Performance | Generally fast (fewer round trips to the DC) | Relatively slow, since an exchange with the DC happens on every authentication |

Because Kerberos is superior overall, a Windows domain environment prefers Kerberos by default, and **only falls back to NTLM in situations where Kerberos can't be used** (an SPN that isn't correctly registered, accessing something directly by IP address, and so on). The real-world problem covered in [Understanding SPNs (Service Principal Names)](/en/articles/ad-spn-guide) — "a missing SPN causes a silent fallback to NTLM" — is precisely this fallback mechanism in action.

### The Token Bloat Problem

Because the PAC contains the SIDs of every group a user belongs to, as noted above, **if a given user belongs to an extremely large number of groups, the PAC's size keeps growing.** Windows imposes an upper limit on the PAC's (token's) size via a parameter called `MaxTokenSize` (roughly 48KB by default), and exceeding this limit causes **some group information to be left out of the token, which can result in being unable to access a resource you should have access to, or authentication itself becoming unstable.** This problem tends to hit users (especially administrator accounts) belonging to many nested groups in large organizations, and in practice, common remedies include adjusting the `MaxTokenSize` registry value, cleaning up unnecessary group memberships, or checking whether the `sIDHistory` attribute (a mechanism for carrying over SIDs from an old domain during a domain migration) has accumulated stale entries.

## Common Misconceptions and Pitfalls

- **Misconception 1: "Kerberos authentication sends the password hash to the KDC"**
  What actually gets sent is a timestamp encrypted with a key derived from the password — the password hash itself never travels over the network. The KDC just independently derives the same key from the hash it already holds, and attempts to decrypt.
- **Misconception 2: "The TGT contains the user's password itself"**
  What the TGT contains is proof of successful authentication, a session key, and so on — not the user's password itself. And since the TGT is encrypted with the KDC's own key, the client can't even read its contents.
- **Misconception 3: "The service checks with the DC every single time a client accesses it"**
  The service side can complete verification entirely by checking whether it can decrypt the presented ticket with its own key — it never needs to query the DC each time. This is one of the reasons Kerberos outperforms NTLM.

## The Troubleshooting Perspective

Triage Kerberos-related failures along the axis of: **"at which stage did it fail — pre-authentication, obtaining the TGT, obtaining the service ticket, or presenting the ticket?"**

1. **Logon itself fails**: Check event ID `4768` (TGT request) in the Security log via Event Viewer on the DC side, to see whether it's failing at the pre-authentication stage.
2. **Logon succeeds, but access to a specific service fails**: Check event ID `4769` (service ticket request) to see whether ticket issuance for the target SPN is failing. Suspect an SPN-related problem, covered in [Understanding SPNs (Service Principal Names)](/en/articles/ad-spn-guide).
3. **Authentication fails in an environment with clock drift**: Check whether time synchronization anchored on the [PDC Emulator](/en/articles/fsmo-guide) is functioning correctly, as covered in [Understanding FSMO (Operations Master) Roles](/en/articles/fsmo-guide). Clock drift beyond the allowed tolerance (5 minutes by default) directly causes pre-authentication failures.
4. **Authentication is unstable specifically for users belonging to many groups**: Suspect token bloat, and consider adjusting `MaxTokenSize` or cleaning up group memberships.

### Preventive Measures and Permanent Fixes

- Periodically confirm that domain-wide time synchronization (the hierarchy anchored on the [PDC Emulator](/en/articles/fsmo-guide)) is functioning correctly.
- Periodically audit whether users — especially administrator accounts — belong to an unnecessarily large number of groups.
- After a domain migration, check whether the `sIDHistory` attribute has accumulated unnecessary entries, and clean it up where needed.

## Summary

- The core of Kerberos authentication rests on the fact that the client and the KDC can each independently derive the same key from the password — what's exchanged as proof is "correctly encrypting and decrypting with that key," not the password itself.
- The TGT is a "sealed certificate" encrypted with the KDC's own key, which even the client itself can't read.
- The PAC (Privilege Attribute Certificate) embedded in tickets contains a list of SIDs for the user and their groups, letting the service side verify authorization information without querying the DC each time.
- When Kerberos can't be used, authentication falls back to NTLM — but NTLM has significant functional limitations (no mutual authentication, no delegation) and worse performance.

**Things to Keep in Mind From Today**
1. When you hit a Kerberos-related failure, triage which stage it's failing at — pre-authentication, TGT acquisition, service-ticket acquisition, or ticket presentation — using event IDs 4768/4769 as your anchor.
2. When you encounter a user with unstable authentication, suspect token bloat from an excessive number of group memberships.

## References

- [Kerberos Authentication Overview | Microsoft Learn](https://learn.microsoft.com/en-us/windows-server/security/kerberos/kerberos-authentication-overview)
- [How Kerberos Pre-Authentication Works | Microsoft Learn](https://learn.microsoft.com/en-us/troubleshoot/windows-server/windows-security/kerberos-authentication-fails-with-error-message)
- [MaxTokenSize and Kerberos Token Bloat | Microsoft Learn](https://learn.microsoft.com/en-us/troubleshoot/windows-server/windows-security/kerberos-authentication-problems-if-user-belongs-to-groups)
