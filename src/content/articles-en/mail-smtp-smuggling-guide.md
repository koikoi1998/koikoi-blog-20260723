---
title: "Understanding SMTP Smuggling From a Top 1% Perspective — Even If SPF/DKIM/DMARC All Pass, It Means Nothing if the Message's Own Boundary Gets Forged"
description: "The authentication covered in How SPF/DKIM/DMARC Works verifies a message's \"outer envelope.\" SMTP smuggling abuses a disagreement between the sending and receiving MTA over where a single message's end-of-data sequence (<CR><LF>.<CR><LF>) actually lies, secretly hiding a second, entirely separate message with a forged sender inside the legitimate outer envelope. Since that outer envelope passes SPF, DKIM, and DMARC, the hidden inner message reaches the inbox with no warning at all."
series: "messaging"
subSeries: "supplementary"
order: 4.4
tags: ["mail", "security", "infra"]
emoji: "📨"
pubDate: 2026-12-14
---

## Introduction

- **What You'll Learn From This Article**: You'll systematically understand **SMTP smuggling** — an attack that abuses the premise that the authentication covered in [How SPF/DKIM/DMARC Works](/en/articles/mail-spf-dkim-dmarc-guide) only ever verifies a message's "outer envelope."
- **Intended Audience**: Readers who understand the basic mechanics of SPF, DKIM, and DMARC, but can't explain how a message passing all three can still be a spoofed email.
- **Estimated Reading Time**: About 20 minutes

This article is part of the [Top 1% Series Complete Article Guide](/en/sitemap), and article 4.4 in the [Messaging Series](/en/sitemap#series-list).

## Prerequisite Knowledge

- [How SPF/DKIM/DMARC Works](/en/articles/mail-spf-dkim-dmarc-guide): A basic understanding of the three mechanisms, SPF, DKIM, and DMARC, is a prerequisite.

## Getting the Big Picture

**An SMTP message body is supposed to end with a fixed end-of-data sequence: `<CR><LF>.<CR><LF>` (a newline, a period, a newline).** **SMTP smuggling abuses a subtle discrepancy in how the sending MTA and the receiving MTA each interpret this sequence (for example, whether a bare LF period, without an accompanying CR, counts as valid end-of-data).** **Using this interpretation mismatch, you can hide an entirely separate, sender-forged second message inside one legitimate message's body.**

```mermaid
sequenceDiagram
    participant Attacker as Attacker
    participant Outbound as Sending MTA
    participant Inbound as Receiving MTA
    Attacker->>Outbound: Embed a forged message with a hidden bare-LF terminator inside a legitimate message's body
    Outbound->>Outbound: Doesn't treat the bare LF as an end marker, forwards it as one single message
    Outbound->>Inbound: Forwards what looks like a single message
    Inbound->>Inbound: Treats the bare LF as an end marker, splitting it into two separate messages
    Inbound->>Inbound: The outer message passes SPF/DKIM/DMARC; the inner, forged one reaches the inbox
```

## Deep Dive Into the Fundamentals

### Why SPF/DKIM/DMARC All Pass Anyway

**What SPF/DKIM/DMARC verify is the outer envelope, genuinely sent over a legitimate connection.** **That outer envelope itself really did arrive from a legitimate sender, with legitimate authentication credentials, so it correctly passes every one of SPF/DKIM/DMARC's checks.** **But the forged message hidden inside it is the result of the receiving MTA's own independent interpretation — "this is actually a separate message" — and falls entirely outside the scope of SPF/DKIM/DMARC's envelope-level verification to begin with.**

### Real-World Vulnerabilities Discovered: Postfix, Sendmail, Exim

**In 2023, this attack technique was confirmed to actually succeed against several major MTA software packages: Postfix (CVE-2023-51764), Sendmail (CVE-2023-51765), and Exim (CVE-2023-51766).** **For Postfix, a fix is available by enabling the `smtpd_forbid_bare_newline=yes` setting, which stops treating a bare LF without a CR as a valid component of the end-of-data sequence, closing this interpretation mismatch directly.**

<details>
<summary>An Attack With the Exact Same Structure as HTTP Request Smuggling</summary>

**This attack carries the exact same structural problem as [HTTP request smuggling, covered in the Load Balancing Department](/en/articles/load-balancing-request-smuggling-handson-guide).** **Both abuse the exact same class of bug: two different implementations disagreeing on "where exactly does one message's boundary lie."** **Whether the protocol is HTTP or SMTP, this is the same more general design challenge — keeping message-boundary interpretation consistent across multiple implementations — showing up in a different form.**

</details>

## What a Pro Sees Here (Top 1% Understanding)

### "Passing Authentication" Never Guarantees "the Message's Boundary Was Correctly Interpreted"

**The authentication mechanisms SPF/DKIM/DMARC verify whether "this envelope genuinely came from a legitimate sender" — they were never meant to verify whether "this message's boundary gets interpreted consistently across every relay in the path."** **The habit of clearly distinguishing what a given verification actually covers from what falls outside its scope** is the perspective a top-1% engineer carries.

## Common Misconceptions and Pitfalls

- **Misconception 1: "A message that passes SPF/DKIM/DMARC entirely can never be a spoofed email."**
  Using a technique like SMTP smuggling, only the outer envelope passes those checks, while a forged message hidden inside it can reach the inbox with no warning.
- **Misconception 2: "This attack is a specialized defect that exists in only one specific MTA software."**
  It's been confirmed to actually succeed against several major MTA software packages: Postfix, Sendmail, and Exim.
- **Misconception 3: "SMTP smuggling and HTTP request smuggling are entirely unrelated, different kinds of problems."**
  Both abuse the exact same structural problem: multiple implementations holding different standards for interpreting a message's boundary.

## Troubleshooting Perspective

1. **A spoofed email arrives despite passing SPF/DKIM/DMARC entirely**: Check whether a technique like SMTP smuggling, abusing a message-boundary interpretation mismatch, is being used.
2. **You want to check whether your organization's MTA is vulnerable to this attack**: Check your MTA software's version, the relevant CVE, and the recommended configuration change.
3. **You want to apply a fix for this attack on Postfix**: Set `smtpd_forbid_bare_newline=yes`, which stops treating a bare LF as a valid component of the end-of-data sequence.

## Summary

- SMTP smuggling abuses a disagreement between the sending and receiving MTA over a message's end-of-data sequence, hiding a second, forged message inside one message.
- Since the outer envelope passes SPF, DKIM, and DMARC entirely, the forged message hidden inside it reaches the inbox with no warning.
- It's been confirmed to actually succeed against several major MTA software packages: Postfix, Sendmail, and Exim.
- This attack shares the exact same structure as HTTP request smuggling: a message-boundary interpretation mismatch.

**Takeaways to Apply Today**
1. Check whether your organization's MTA software already has the known fix for SMTP smuggling applied.
2. Whenever something "passes authentication," always dig one layer deeper to check exactly what that verification actually covers.

## References

- [SMTP Smuggling Enables Email Spoofing While Passing Security Checks | CSO Online](https://www.csoonline.com/article/1269779/smtp-smuggling-enables-email-spoofing-while-passing-security-checks.html)
- [Explained: SMTP Smuggling | ThreatDown](https://www.threatdown.com/blog/explained-smtp-smuggling/)
