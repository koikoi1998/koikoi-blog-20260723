---
title: "[Listen] The Web Proxy/Caching Fundamentals Series, Fully Recapped"
description: "An audio-learning article that reviews all 9 articles of the Web Proxy/Caching Fundamentals series by ear, during a commute or while doing chores. No tables, diagrams, or bullet points — just spoken-style prose meant to be read aloud by a browser's text-to-speech feature."
series: "web-proxy"
subSeries: "audio"
order: 11
tags: ["proxy", "cache", "audio-review", "web"]
emoji: "🎧"
pubDate: 2026-10-21
---

This article is an audio-learning recap for anyone who's already read all nine articles in the Web Proxy/Caching Fundamentals series. Use your browser's or phone's text-to-speech feature and let it play in the background during a commute or while doing chores. There are no diagrams, tables, or code here — just spoken-style prose, stitching the whole series back together into a single, continuous thread.

The series started with when to use a proxy versus a firewall. Both control traffic, but we covered the difference between explicit proxying, where the client specifies a proxy server, and transparent proxying, where traffic gets relayed without the client ever knowing, along with how cloud proxies (SWG) and zero trust relate to this.

Next came the rise of HTTPS and the end of proxy caching. A proxy server used to reduce traffic volume by caching website content, but once HTTPS became the norm, the proxy lost the ability to decrypt the traffic's content, and caching's main role shifted to the browser's own cache and the CDN — a historical shift we covered in detail.

Then came putting everything from the lecture into practice, hands-on, actually building it with Squid. You implemented URL-level access control through a mechanism called an ACL, and read through the access log to confirm exactly which requests got allowed and which got denied.

From here, the series moved into more advanced territory. First, PAC files and WPAD. Manually distributing proxy settings to hundreds of machines across a company isn't realistic. We covered the two-stage mechanism: a PAC file, a single function written in JavaScript, expressing the logic for which proxy to use based on URL or hostname, and WPAD, automatically discovering that PAC file's own location using DHCP or DNS.

Next came proxy authentication. The three methods, Basic, NTLM, and Kerberos, could be understood as a staged design decision about how much of the password, a piece of sensitive information, you're willing to expose on the network. Basic is effectively plaintext, NTLM exchanges only a value derived from the password via a challenge-response scheme, and Kerberos uses a ticket, never letting any information about the password travel over the network at all. We also covered status code 407, separate from 401, signaling that the proxy itself is demanding authentication.

Then came Cache-Control and the Vary header. We covered how max-age represents the cache's valid duration, no-cache instructs "store it, but re-validate before use," and no-store instructs "never store it at all" — three separate instructions. And we covered how the Vary header makes requests to the same URL get managed as separate caches, whenever the value of a specified request header differs.

The final article put building Squid as a caching proxy into practice, hands-on, actually confirming everything from the lecture. You confirmed a second access to the same URL showing HIT via the X-Cache header, answered instantly without ever querying the origin server at all. You confirmed it returning to MISS once the max-age expiration passed. And you confirmed, with your own hands, that accessing with different Accept-Language headers got correctly separated into distinct caches thanks to the Vary specification — and that removing that Vary specification let a response that should have been separate get incorrectly served from the same cache instead.

From here, the series moved into two more advanced hands-on labs. First, building a transparent proxy with iptables and Squid. Where an explicit proxy required configuring a proxy address on the client side, iptables's REDIRECT target rewrote an HTTP connection's destination to the local Squid instance, without the client ever noticing, and Squid's intercept mode correctly relayed that traffic with its disguised destination. This convenience comes at a cost: since the client validates the destination's certificate on HTTPS traffic, silently rewriting the destination fails certificate validation, so a transparent proxy only ever works, in principle, for unencrypted traffic.

The final article was a hands-on reproducing Squid's open-proxy danger and defending with ACL-based access restriction. Building a proxy with zero access restriction configured turns it into an "open proxy," accepting a relay request from anyone, regardless of source, carrying a real danger of getting abused as a stepping stone, letting a third party hide their identity while attacking another server. You confirmed that Squid's acl configuration prevents this danger, by explicitly defining the allowed source network and explicitly denying everything else. The lesson: access control is premised on closing with an explicit final deny rule, not just listing allow rules.

Looking back across all nine articles, one consistent pattern emerges. The difference in layer between explicit and transparent proxying, the difference between a PAC file's decision logic and WPAD's discovery mechanism, the staged difference in how much sensitive information gets exposed across Basic, NTLM, and Kerberos, the difference between Cache-Control's duration and Vary's distinguishing condition, a transparent proxy's real identity as a destination rewrite via iptables, and the open proxy's risk structure common across relay-type services in general — every one of them shared the same shape: behind what looks like one single, simple mechanism, several independent decision axes are actually combined together. Looking at a proxy's or a cache's behavior in front of you, and digging one layer deeper to ask what the real decision axis underneath actually is. That's the perspective a top-1% engineer carries away from this series. And that's the recap of the Web Proxy/Caching Fundamentals series, complete.
