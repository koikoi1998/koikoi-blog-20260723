---
title: "[Audio Lecture] Active Directory, Part 2: From SPN/Netlogon/Kerberos Authentication to FSMO and Replication"
description: "The second installment of the audio lecture series. Carefully builds up what an SPN actually points to, the Netlogon secure channel, why Kerberos authentication never has to send your password, FSMO as an exception, and how replication between DCs actually works. No tables, diagrams, or bullet points — just spoken-style prose."
series: "active-directory"
subSeries: "lecture"
order: 0.1
tags: ["windows-server", "active-directory", "audio-lecture"]
emoji: "🎙️"
pubDate: 2026-09-26
---

## How to Listen to This Lecture

Hello, and welcome to Part 2 of the Active Directory lecture series. [Part 1](/en/articles/ad-audio-lecture-1-guide) covered AD DS and the DC, the three boundaries of domain, tree, and forest, renaming a computer, what's behind a login, and AD's DNS design. Today we continue with what actually happens behind authentication, and the mechanism that keeps data synchronized across multiple DCs. You don't need to have listened to Part 1 first — this one stands on its own — though listening in order is still recommended if you can. As before, no tables, code blocks, or diagrams here — just spoken-style prose.

Today we'll cover what an SPN, a small identifier, actually points to; the Netlogon service and the secure channel; why Kerberos authentication never has to send your password; FSMO, an exceptional set of roles; and replication, the mechanism that keeps data synchronized across multiple DCs.

## An SPN Points at an Account, Not a Server

Let's start with the SPN, the service principal name — a small identifier that trips a lot of people up. An SPN doesn't point at the server itself — it points at the account actually running that service. Say SQL Server is running on some server: its SPN gets registered on the service account that's actually running the SQL Server service. Once that clicks, a very common real-world failure suddenly makes sense: someone changes which account runs a service, forgets to move the SPN over to the new account, and authentication quietly breaks. That happens because the link between the SPN and the account has been broken.

The command for registering an SPN has an A option and an S option. The S option is the safer choice, since it checks ahead of time whether the SPN you're about to register is already registered, in duplicate, on some other account. That kind of duplication throws the entire Kerberos authentication process into confusion, which is exactly why using the S option is recommended in practice.

## Netlogon and the Secure Channel, and the VM Snapshot Trap

Next, the Netlogon service. What Netlogon's so-called secure channel actually is turns out to be mutual authentication based on the computer account's password. A computer joined to the domain has its own password, just like a human user account does. And by default, that password automatically rotates roughly every 30 days.

This leads to an important lesson worth remembering in practice. What happens if you restore a virtual machine's snapshot to a state older than 30 days? The password remembered inside that snapshot is already stale. But on the AD DS side, it's already been rotated to a new one. This mismatch triggers a trust relationship failure. Hit this without knowing the cause and you're completely stuck — but knowing it, you can often fix it with the secure channel repair command, without the far more drastic step of rejoining the domain.

And underneath, what Netlogon actually uses is a mechanism called RPC, remote procedure call — a general-purpose mechanism that lets a program on one computer invoke a procedure on another computer as if it were just a local function call of its own.

## Why Kerberos Never Has to Send Your Password

Now for one of the most central topics in this entire series: Kerberos authentication. A client and the KDC, the key distribution center, can each independently derive the same key from the user's password. That's exactly why the password itself never needs to be sent at all — all that's exchanged is proof that both sides can correctly encrypt and decrypt with that shared key.

The first thing issued by the KDC is the TGT, the ticket-granting ticket — a sealed certificate encrypted with the KDC's own key. Even the client holding it can't read what's inside. Using this TGT, every time you access an individual service, you request a separate service ticket, specific to that service, each time. It's not one all-purpose ticket handed out at login — it's a two-stage design: the TGT acts as an entry pass, and an individual ticket gets issued per service, on demand, based on it.

And a service ticket is encrypted not with the client's key, but with the key of the service account being accessed. Why is it done this way? If it were readable by the client, the client could freely tamper with its contents. Encrypting it with the service's own key instead turns the client into something like a courier — carrying the ticket from one place to another, unable to either read or rewrite what's inside.

Embedded inside this ticket is something called the PAC, which records the user themselves and the SIDs of every group they belong to. This is the concrete implementation behind the principle that Windows permission management is based on the SID identifier, not the username string.

## FSMO: The One Exception to Multi-Master Replication

Next, FSMO. AD DS fundamentally operates on the idea of being "multi-master" — a change made on any DC propagates out to every other DC, all as equal peers. But certain operations that could cause conflicts if performed simultaneously on multiple DCs are restricted to a single DC. These are the five exceptional roles known as FSMO, Flexible Single Master Operations.

The Schema Master and Domain Naming Master each exist exactly once per forest. The RID Master, PDC Emulator, and Infrastructure Master each exist exactly once per domain. And there are two ways to move these roles to a different DC: a graceful "transfer," done through the proper procedure while the old DC is still alive, and a "seize" — a forced wresting-away, used as a last resort once the old DC is truly gone. Understand that a seize is a final, irreversible move you can never undo.

There's one more thing worth remembering about the Infrastructure Master: it must never be placed on the same DC as a global catalog. A global catalog always holds up-to-date information about other domains. Which means the stale references the Infrastructure Master is specifically supposed to detect simply never occur on a global catalog in the first place — so it loses the ability to detect them at all. That said, in a single-domain forest where every DC also happens to be a global catalog, this constraint stops mattering entirely.

## Replication: How DCs Keep Their Data in Sync

Finally, replication — the mechanism that keeps data synchronized across multiple DCs. This mechanism runs on the USN, the update sequence number — a simple, ever-increasing number. Every time something changes on a given DC, that DC's USN increments by one. Other DCs compare this USN to detect "a newer change I haven't received yet," and pull in only that.

This USN-based mechanism also matters a great deal in disaster recovery. If you've merely restored from a backup, that DC's USN is stuck at an old value — every other healthy DC sees it as nothing but "old information," and it ends up overwritten by replication regardless. Only by going through the special procedure of an authoritative restore — deliberately rewriting that USN to a future value — can the restored content actually be made to stick.

And for replication across locations, a mechanism called a site — which teaches AD DS about physical distance — comes into play. Replication within a site propagates almost instantly, while replication across sites is, by design, built around accepting a deliberate, schedule-based delay of at least 15 minutes by default. The actual path between locations is automatically calculated by a mechanism called the KCC, the Knowledge Consistency Checker, based on a number called cost that an administrator configures. And remember: this cost isn't the line's actual bandwidth — it's an abstract number an administrator uses to express how strongly they want a given path preferred.

## Today's Recap

That's all for today — let's recap. An SPN is an identifier pointing at the account running a service, not the server itself. Netlogon's secure channel is mutual authentication based on the computer account's password, rotating roughly every 30 days by default, which is exactly why restoring an old VM snapshot can trigger a failure. Kerberos authentication never sends the password itself at all, achieving identity verification through the two-stage mechanism of a TGT and service tickets. FSMO is the one exception within multi-master replication, with two ways to move it — transfer and seize. And replication is a mechanism where DCs detect each other's changes based on the ever-increasing USN number.

In the next lecture, we'll cover DC health checks, the physical mechanics of sites, and GPOs — areas directly tied to day-to-day operations. Thanks for listening today — that's a wrap.
