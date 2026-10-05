---
title: "[Incident Investigation] A Top 1% Hands-On for Investigating, From the Error Itself, Why You Can't Log In as Administrator After Promoting a New DC"
description: "RDP's connection popup authenticates fine, but the new DC's own login screen rejects you. Rather than following a written procedure, trace this incident from the actual errors you'd encounter, one at a time, following the same path to the real root cause: the type of Kerberos key stored for the Administrator account. An incident-investigation-style hands-on, for anyone who's hit this exact symptom and doesn't know why."
series: "active-directory"
subSeries: "handson"
order: 15.1
tags: ["windows-server", "active-directory", "kerberos", "ntlm", "handson", "troubleshooting"]
emoji: "🔍"
pubDate: 2026-10-05
---

## Introduction

- **What You'll Learn From This Article**: Among the real-world scenarios covered in [the DC migration (replacement) hands-on](/en/articles/ad-migration-handson-guide), trace, from the position of someone who's actually hit it, the common incident where "**right after promoting a new DC, you can no longer log in as Administrator**," investigating the errors one at a time. Unlike a hands-on that follows fixed steps, this takes the exact format of real-world troubleshooting itself: "**figuring out the cause through investigation, starting from a state where the cause is unknown.**"
- **Intended Audience**: Readers who've hit this exact incident right after promoting a new DC — being unable to log in as Administrator — and are stuck without knowing the cause or the fix, or readers about to perform a similar DC replacement.
- **Important Note**: The root-cause analysis in this article is grounded in the mechanisms covered in [How NTLM Authentication Works](/en/articles/ad-ntlm-mechanism-guide) and [Understanding IAKerb and LocalKDC](/en/articles/ad-iakerb-localkdc-guide), together with Microsoft's own published information and community-reported cases, but no document exists where Microsoft has officially pinned down this root cause — this article presents **the hypothesis with the strongest evidence currently available.** If you hit a similar incident in a real environment, use this article's investigation steps as a reference, but always cross-check them against what's actually happening in your own environment.
- **Estimated Reading Time**: About 28 minutes

This article is part of the [Top 1% Series Complete Article Guide](/en/sitemap), and article 15.1 in the [Active Directory Series](/en/sitemap#series-list).

## Prerequisite Knowledge

- **The Difference Between NTLM and Kerberos**: The fundamental difference between the two, covered in [How NTLM Authentication Works](/en/articles/ad-ntlm-mechanism-guide) and [How Kerberos Authentication Works](/en/articles/ad-kerberos-guide).
- **The Basic DC Migration Procedure**: The basic FSMO transfer and demotion flow, covered in [the DC migration (replacement) hands-on](/en/articles/ad-migration-handson-guide).

## The Symptom: After the Post-Promotion Reboot, You Can No Longer Log In as Administrator

**While testing a replacement from an old DC to a new DC (Windows Server 2025) on AWS, the following incident occurred.**

1. Promoting the new server to a DC triggered an automatic reboot.
2. After the reboot, an RDP connection was attempted from a jump server to the new DC.
3. **The RDP connection's popup (the credentials entry screen) showed no authentication error at all.**
4. **But instead of transitioning to the new DC's desktop, the new DC's own Windows login screen rejected the password.**
5. Logging into the old DC and resetting the Administrator account's password made the RDP connection to the new DC succeed normally.

**Let's walk through how to investigate this, starting from a state where you don't know the procedure at all.**

## Investigation Step 1: Narrow Down Which Stage Is Failing, Using the Event Log

As covered in [the troubleshooting section of How Kerberos Authentication Works](/en/articles/ad-kerberos-guide#the-troubleshooting-perspective), a Kerberos-related failure gets narrowed down by **which stage is failing**, using event IDs as the axis. Check the new DC's own security log.

```powershell
Get-WinEvent -FilterHashtable @{LogName='Security'; Id=4768,4771} -MaxEvents 20 |
    Select-Object TimeCreated, Id, Message | Format-List
```

**Output (relevant part, illustrative):**

```
TimeCreated : 2026-10-05 10:15:32
Id          : 4771
Message     : Kerberos pre-authentication failed.
              Account Information: Administrator
              Failure Code: 0x17 (KDC_ERR_ETYPE_NOTSUPP)
```

**Event ID 4771 (a pre-authentication failure) is recorded, with the failure code `0x17` (`KDC_ERR_ETYPE_NOTSUPP`, "unsupported encryption type").** This means **the KDC doesn't hold a key, for this account, matching the encryption type (etype) the client presented.** The client side likely attempted pre-authentication with AES (the newer, now-default encryption type), and you can infer it was rejected at this stage because **no AES key exists for this account on the KDC side.**

<details>
<summary>Why Didn't RDP's Popup Show an Error?</summary>

The credentials-entry popup during an RDP connection (NLA, Network Level Authentication) is **network-level authentication for starting the connection.** Even if authentication appears to get accepted here in some form, **the actual Windows logon process (Winlogon) that transitions you to the desktop is a separate, more rigorous authentication exchange.** Event ID 4771, confirmed in this article, is a record of the failure in the Kerberos authentication happening behind the scenes of that Winlogon stage. **"No error from the popup" never means "authentication fully succeeded"** — this is one reason this incident is confusing.

</details>

## Investigation Step 2: Confirm Whether This Account Genuinely Lacks an AES Key

Confirm the hypothesis raised from the event log, from a different angle. Microsoft's own published documentation contains an important statement: **"the built-in Administrator account does not have an AES key, unless its password was changed on a DC running Windows Server 2008 or later."**

```powershell
# Check this domain's Administrator account's last password change timestamp
Get-ADUser -Identity Administrator -Properties PasswordLastSet, whenCreated |
    Select-Object Name, PasswordLastSet, whenCreated
```

**Output (illustrative):**

```
Name          PasswordLastSet       whenCreated
----          ---------------       -----------
Administrator 2019-04-02 09:12:00   2019-04-02 09:10:15
```

**It turns out this domain's Administrator account's password has never been changed since the domain was created.** **Exactly at the moment a password is set, the AES and RC4 keys each get computed and stored.** In other words, the real dividing line wasn't "whether the KDC service was running" at all — it was **"what encryption-type keys were actually computed, the last time this account's password was set."**

<details>
<summary>How This Differs From the Initial Hypothesis (That the KDC Service Hadn't Started)</summary>

In this investigation, **no supporting evidence was found for the hypothesis that "the AES key wasn't created because the KDC service hadn't started yet at the time of new-DC promotion."** AES and RC4 key computation happens through **the password-change processing pipeline (internal LSA/NTDS processing)**, not through the KDC service itself (the running Kerberos runtime process, as a Windows service) — so it has no direct relationship to whether the KDC service happens to be running. **The real deciding factor was instead the password's own history: when, and on which DC, this account's password was last set.**

</details>

## Investigation Step 3: Confirm Why Resetting the Password Fixed It

After resetting Administrator's password on the old DC, the RDP connection to the new DC started succeeding. This can be explained by the fact that **resetting the password newly computed both the AES and RC4 keys, and replicated them to every DC in this domain, including the new DC.**

```powershell
# After the password reset, confirm replication has reached the new DC
repadmin /showrepl <new-DC-hostname>
```

**Output (relevant part, illustrative):**

```
Last success time: 2026-10-05 10:45:12 (no errors)
```

**Once you confirm replication completed successfully, the AES-capable key should now be available on the new DC side too.**

## What a Pro Sees Here (Top 1% Understanding)

### The Real Lesson From This Incident: "An Old Password Keeps Carrying Its Old Encryption Type"

The single most important lesson from this incident is that **"when an account has existed for a long time and its password has never been changed, that account's credentials stay frozen at whatever encryption type was in effect the last time that password was set — carried forward unchanged, for years, across however many OS upgrades."** No matter how many versions newer you upgrade a domain's OS or DCs to, **an existing account's own credentials never automatically "get rewritten" to a newer encryption type.** The only moment that actually refreshes an account's credentials is the moment its password actually gets changed. This is a risk that runs through migrations and upgrades in general: **"old data stays old, unless there's an explicit opportunity to regenerate it"** — in contrast to [how RAID5's parity never duplicates data, holding only the minimum information needed](/en/articles/raid5-parity-guide).

### What Happens Building a Brand-New Windows Server 2025 DC on AWS

Building on this article's investigation, consider the case of **building an entirely new (no existing DC) forest and domain from scratch, on Windows Server 2025.** **In this case, the Administrator account's password gets set exactly during the forest-creation wizard's execution (`Install-ADDSForest`), on that very Windows Server 2025 machine.** Based on this article's findings, **both the AES and RC4 keys should get computed right at that moment, and this incident should not normally occur.** This incident actually becomes a real problem only in **the specific scenario of gradually migrating an existing, old domain to new DCs** — exactly the kind of replacement scenario covered here.

## Common Misconceptions and Pitfalls

- **Misconception 1: "If RDP's connection popup shows no error, authentication fully succeeded."**
  The popup during an RDP connection authenticates to start the connection; the actual Windows logon process that transitions you to the desktop is a separate exchange.
- **Misconception 2: "If the KDC service isn't running, the Kerberos key itself never gets computed."**
  AES and RC4 key computation happens through the password-change processing pipeline, with no direct relationship to whether the KDC service (its running process as a Windows service) happens to be running.
- **Misconception 3: "Upgrading the OS or DC to a newer version automatically updates an existing account's credentials to the newer encryption type too."**
  An existing account's credentials stay at their previous encryption type, unless its password actually gets changed.

## Troubleshooting Perspective

1. **One specific account can't log in right after a new DC promotion**: Check event ID 4771's failure code; if it's `KDC_ERR_ETYPE_NOTSUPP`, check that account's last password change timestamp.
2. **Resetting the password still doesn't fix the login**: Use `repadmin /showrepl` to confirm replication to the new DC completed successfully.
3. **The same incident occurred even on a freshly built new forest**: Check whether the Administrator account's password history, through some means (restoring from a backup, migrating from a different domain, and similar), actually predates this new forest's creation.

### Preventive Measures and Permanent Fixes

- **Build "explicitly reset the password of any privileged account you plan to use, on the current DC, before performing a DC replacement" into your work procedure.** Treat this as a preventive measure taken in advance, not a reactive fix after the fact.
- Periodically audit the last password change timestamp for privileged accounts in an existing domain, checking for any account that's gone unchanged for a long time.

## Summary

- The incident of being unable to log in as Administrator right after a new DC promotion relates to the fact that RDP's popup authentication and Windows's own logon process (Kerberos authentication) are two separate exchanges.
- Event ID 4771 with failure code `KDC_ERR_ETYPE_NOTSUPP` indicates the KDC holds no key matching the client-presented encryption type, for this account.
- Since AES and RC4 keys get computed exactly when a password is actually set, an account whose password hasn't changed in a long time may only hold an older encryption type's key.
- This incident doesn't normally occur when building a brand-new forest with Windows Server 2025 — it's specific to replacing an existing domain's DCs.

**Takeaways to Apply Today**
1. Before performing a DC replacement, always explicitly reset the password of any privileged account you plan to use beforehand.
2. Never judge authentication as fully successful just because "the popup showed no error."

## References

- [Guidance About How to Configure Protected Accounts | Microsoft Learn](https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/manage/how-to-configure-protected-accounts)
- [Kerberos Authentication Fails With Error Message | Microsoft Learn](https://learn.microsoft.com/en-us/troubleshoot/windows-server/windows-security/kerberos-authentication-fails-with-error-message)
- [How NTLM Authentication Works](/en/articles/ad-ntlm-mechanism-guide)
