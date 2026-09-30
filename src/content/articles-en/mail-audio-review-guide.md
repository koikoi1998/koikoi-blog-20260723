---
title: "[Listen] The Mail Infrastructure Series, Fully Recapped"
description: "An audio-learning article that reviews all 7 articles of the Mail Infrastructure series by ear, during a commute or while doing chores. No tables, diagrams, or bullet points — just spoken-style prose meant to be read aloud by a browser's text-to-speech feature."
series: "messaging"
subSeries: "audio"
order: 8
tags: ["email", "audio-review", "infra"]
emoji: "🎧"
pubDate: 2026-09-30
---

This article is an audio-learning recap for anyone who's already read all seven articles in the Mail Infrastructure series. Use your browser's or phone's text-to-speech feature and let it play in the background during a commute or while doing chores. There are no diagrams, tables, or code here — just spoken-style prose, stitching the whole series back together into a single, continuous thread.

The series started with what migrating mail from an on-premises Exchange Server to M365, Exchange Online, actually means as concrete work — which specific pieces get switched over. It also covered how a mail address's domain relates to a website's domain.

Next came the fundamentals of a mail server. Where Exchange handles both the MTA role and mailbox storage in a single product, the open-source world splits these across multiple pieces of software, Postfix and Dovecot, under a division of labor called MTA, MDA, and MUA. We also organized the difference between the two protocols involved: SMTP, handling transfer between mail servers, and IMAP, handling retrieval from a mailbox.

Then came the hands-on of actually installing Postfix and Dovecot, and sending and receiving mail by typing raw SMTP and IMAP commands over telnet by hand. You confirmed with your own hands an unglamorous but easy-to-miss spec: after the DATA command, the end of the body has to be marked with a line containing a single period.

From here, the series moved into more advanced territory. First, the three mechanisms SPF, DKIM, and DMARC. SMTP has a structural weakness — it lets a sender's domain be spoofed in the first place. SPF verifies whether the sending IP address is legitimate, and DKIM verifies whether the body and headers were tampered with along the way, each independently. DMARC then combines those two results with alignment — matching against the From header — letting the sending domain's own owner declare what should happen on failure.

Next came mail queues and bounces. Even if a sent email doesn't arrive right away, Postfix keeps it in the queue and retries at intervals. A leading digit of 4 on the SMTP response code means a temporary error, while 5 means a permanent one, and that distinction decides whether Postfix keeps retrying or gives up and sends a bounce email back to the sender. We also touched on a small but important design detail: a bounce email's own sender address is deliberately left empty, to prevent an infinite chain.

Then came encryption in SMTP. SMTP was a protocol never designed with encryption in mind to begin with. STARTTLS, a mechanism for upgrading an existing plaintext connection into an encrypted one after the fact, was the answer to that historical constraint. But a weakness remains — opportunistic encryption still sends in plaintext if the other side doesn't support it. MTA-STS, a relatively recent mechanism, reinforces that weakness by combining DNS and HTTPS.

The final article put the SPF, DKIM, and DMARC lecture into practice, hands-on. You actually published an SPF record to DNS and confirmed mail from a sender outside its range actually getting rejected. You also confirmed that wiring in OpenDKIM automatically attaches a digital-signature header to outgoing mail. The understanding that SPF is receiving-side and DKIM is sending-side — an asymmetric division of roles — took shape here as an actual, working configuration.

Looking back across all seven articles, one consistent pattern emerges. The SMTP protocol was originally designed on a kind of good-faith assumption — sender spoofing and eavesdropping were never part of the original picture. SPF, DKIM, DMARC, STARTTLS, and MTA-STS are all mechanisms for trust and safety, layered on top of that good-faith protocol after the fact. The habit this series builds isn't being satisfied on the surface with "the mail got sent, the mail arrived" — it's understanding which mechanism is compensating for which weakness, and how. That's the perspective a top-1% engineer carries away from this series. And that's the recap of the Mail Infrastructure series, complete.
