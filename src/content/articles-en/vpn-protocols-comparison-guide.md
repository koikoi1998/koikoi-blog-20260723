---
title: "Comparing L2TP/IPsec to Modern VPN Protocols from a \"Top 1%\" Perspective — How It Differs from IKEv2/IPsec, OpenVPN, and WireGuard"
description: "What's the concrete technical basis for calling L2TP/IPsec \"legacy\"? A systematic comparison of design philosophy, implementation size, mobile resilience, and performance against the VPN protocols in widespread use today: IKEv2/IPsec, OpenVPN, and WireGuard."
series: "network"
order: 10
tags: ["network", "vpn", "wireguard", "openvpn", "ipsec", "security"]
emoji: "🛡️"
pubDate: 2026-08-03
---

## Introduction

- **What You'll Learn From This Article**: What's really behind the assessment that "L2TP/IPsec is legacy"—specifically which parts of its design are considered dated—along with a systematic understanding of the design philosophies behind IKEv2/IPsec, OpenVPN, and WireGuard, the protocols in widespread use for remote-access VPNs today, and the criteria you should use to choose between them.
- **Intended Audience**: This article is aimed at infrastructure engineers involved in building or selecting remote-access VPNs who have heard that "L2TP/IPsec is old" but can't concretely explain what's different about it, or why the newer protocols are considered superior.
- **Estimated Reading Time**: About 20 minutes

This article is part of the [Top 1% Series' full article guide](/en/sitemap).

## Prerequisites

- **VPN (Virtual Private Network)**: A general term for technology that creates a logical communication path over a public network like the internet, functioning as if it were a dedicated line.
- **Symmetric-Key vs. Public-Key Cryptography**: Symmetric-key cryptography uses the same key for encryption and decryption, while public-key cryptography uses a different key pair for each. VPNs typically use public-key cryptography for key exchange and authentication, and fast symmetric-key cryptography for encrypting the actual data.
- **UDP/TCP**: UDP is a lightweight, connectionless protocol with no retransmission control; TCP is connection-oriented, with acknowledgment and retransmission control.

## Getting the Big Picture

### In a Nutshell

**The single biggest reason L2TP/IPsec is called "legacy" comes down to a difference in design philosophy: it's a "patchwork" combination, bolted together after the fact, of two protocols originally designed for entirely different purposes—a tunneling technology with no encryption (L2TP) and an encryption technology with no user-authentication capability (IPsec, as based on IKEv1)—whereas the protocols in mainstream use today were built from the ground up with a consistent design aimed at a single goal: secure remote-access VPN.**

```mermaid
graph TB
    subgraph Legacy["L2TP/IPsec (a patchwork combination)"]
        L1["L2TP (tunnel + authentication)"] -.combined after the fact.-> L2["IPsec (encryption)"]
    end
    subgraph Modern["Modern VPN protocols (consistently designed)"]
        M1["IKEv2/IPsec<br/>(designed as an integrated whole, within IPsec, from the start)"]
        M2["OpenVPN<br/>(a self-contained, consistent design built on TLS)"]
        M3["WireGuard<br/>(a minimal design built on the Noise framework)"]
    end
```

Here's a summary of the main differences among the four protocols:

| Protocol | Standardized/Introduced | Transport It Runs Over | Rough Implementation Size | Resilience on Mobile Networks |
|---|---|---|---|---|
| L2TP/IPsec | L2TP: 1999 (RFC 2661); IPsec: 1995 onward (multiple RFCs) | UDP (500/1701/4500) | Large (requires a separate IKE daemon, L2TP daemon, and PPP daemon) | Weak (an IP address change tends to force re-establishment of the IKE SA) |
| IKEv2/IPsec | 2005 onward (RFC 7296, used without L2TP) | UDP (500/4500) | Large (self-contained in a single IKE daemon, but the implementation still inherits much of IKEv1-era complexity) | Strong (the MOBIKE extension handles IP address changes) |
| OpenVPN | 2001 onward | UDP or TCP (port number is freely configurable) | Medium-to-large (a user-space implementation built on OpenSSL) | Implementation-dependent (by default, tends to require session re-establishment) |
| WireGuard | Merged into the Linux kernel in 2020 | UDP | Small (the core is roughly 4,000 lines) | Strong (peers are identified by public key, not IP address, so it doesn't depend on the IP address staying fixed) |

## Fundamentals, Thoroughly Explained

### Why Is L2TP/IPsec Called "Legacy"?

The grounds for considering L2TP/IPsec dated boil down to three main points.

1. **The complexity of implementation and operations that comes from combining several independent standards**: Getting L2TP/IPsec working requires three separately developed software components to cooperate: an IPsec daemon that handles IKE/ESP (e.g., strongSwan), an L2TP daemon that handles L2TP tunnels and sessions (e.g., xl2tpd), and a PPP daemon that handles PPP negotiation (e.g., pppd). Because a single connection sequence spans multiple processes and protocol stacks, isolating problems during failures is difficult, and interoperability bugs between different implementations have historically been reported quite often.
2. **Weakness when a mobile client switches networks**: In the IKEv1-based IPsec that L2TP/IPsec relies on, the SA (Security Association) is tightly bound to the client's IP address. When the client's IP address changes—switching from Wi-Fi to a mobile connection, for instance—the existing IKE SA and ESP SA become unusable as-is, and most implementations require renegotiating from Phase 1 all over again. This doesn't sit well with how mobile devices are used today.
3. **Known weaknesses around key exchange and authentication**: Individually, mitigations exist for issues like the risk of offline brute-force attacks against a pre-shared key (PSK) in IKEv1's Aggressive Mode, or the cryptographic weaknesses in MS-CHAPv2 used for PPP authentication (switching to Main Mode, moving to certificate-based authentication, and so on). But the fact that the design leaves so much room to end up choosing a weak configuration in the first place is a recurring finding in security audits.

None of this means "secure communication is categorically impossible with L2TP/IPsec"—**with the right configuration (certificate-based authentication, Main Mode, operating in a way that doesn't depend on MOBIKE-style mobility, etc.), it can achieve entirely adequate security in practice.** But the fact that so many of these configurations demand careful attention from administrators is a relative weakness compared to protocols designed from the ground up to default to the safe choice.

### IKEv2/IPsec: The "Evolved" Version That Skips L2TP

**IKEv2 (RFC 7296)** is the key-exchange protocol standardized as IKEv1's successor. The decisive difference from L2TP/IPsec is that **IKEv2 by itself, without going through L2TP, can provide everything a remote-access VPN needs.**

- **Standard support for EAP authentication**: Where IKEv1-era deployments relied on vendor-specific extensions (like XAuth) for per-user authentication, IKEv2 built this in as a standard feature using EAP (Extensible Authentication Protocol). This lets IKEv2 itself take on the role PPP authentication used to play under L2TP, without going through L2TP at all.
- **Configuration Payload**: The job L2TP's IPCP used to handle—handing out a virtual IP address and DNS server—is also natively supported by IKEv2 through a mechanism called the Configuration Payload.
- **MOBIKE (RFC 4555)**: An IKEv2 extension that lets the existing IKE SA and IPsec SA be carried over to a new IP address, even when the client's IP address changes. This is the mechanism that directly resolves the "weakness under mobile networking" described above.

In short, IKEv2/IPsec can be understood as a configuration that **resolves the very root cause that gave rise to L2TP/IPsec in the first place—"IPsec by itself had no mechanism for user authentication or virtual IP assignment"—by extending IPsec's own standard specification.** This is exactly why so many of the built-in VPN clients on Windows, iOS, macOS, and Android natively support IKEv2/IPsec alongside L2TP/IPsec.

### OpenVPN: A General-Purpose VPN Built on TLS

**OpenVPN** is a piece of VPN software that reuses the same library (OpenSSL) that underpins TLS (SSL), the protocol widely used to secure HTTPS traffic on the web, implementing key exchange, authentication, and encryption as a single, consistent protocol stack. Rather than IPsec's "combination of several separate standards," it's built on a single design based on a TLS handshake, and supports both certificate-based and PSK authentication.

OpenVPN's biggest practical advantage is that **it can run over TCP as well as UDP, and the port number it uses is entirely configurable.** If it's configured to use TCP port 443 (the port ordinarily used for HTTPS), it looks, to any firewall or proxy along the path, like nothing more than "ordinary HTTPS traffic"—making it much easier to establish a connection even on restrictive networks that tend to block UDP or IPsec-related protocols. On the other hand, because the implementation runs in user space (exchanging data with the kernel through a virtual network interface—a TUN/TAP device), every packet incurs a context switch between user space and kernel space, which tends to put OpenVPN at a throughput disadvantage compared to WireGuard, discussed next.

### WireGuard: A Modern Design Built Around Radical Minimalism

**WireGuard** is a comparatively new VPN protocol and implementation, merged into the Linux kernel proper (5.6) in 2020. Its design philosophy stands in stark contrast to IPsec's and OpenVPN's: it's built on the principle that **"drastically shrinking the number of choosable cryptographic algorithms, and fixing on a single modern, well-proven cipher suite, eliminates the very possibility of misconfiguration or downgrade attacks."**

- **A fixed cipher suite**: Key exchange always uses Curve25519 (elliptic-curve Diffie-Hellman), encryption always uses ChaCha20, integrity verification always uses Poly1305, and the hash function is always BLAKE2s—all fixed in advance, with no alternative choices. Because there's no negotiation step at all (unlike IKE's "agree on which algorithm to use during negotiation"), the risk of ending up with a weak algorithm, and the room for bugs to hide in the negotiation logic itself, are structurally eliminated.
- **An extremely small implementation**: The core of WireGuard's kernel implementation is said to come in at roughly 4,000 lines, a stark contrast to OpenVPN (said to exceed 100,000 lines) or the similarly large IPsec implementations like strongSwan—giving it a real practical advantage for code review and security auditing.
- **Peer identification via public key**: WireGuard identifies its peer not by "IP address" but by a **public key exchanged in advance**. As long as authentication succeeds using the correct key pair, communication can continue even if the client's IP address changes—no dedicated extension like IKEv2's MOBIKE is needed, because the design itself is inherently resilient to network changes on mobile devices.

## The View from the Top 1% (What Experts See)

### Why "Complexity" Directly Translates into Security Risk

In the world of VPN protocols, the principle that **"complexity in the implementation or specification itself widens the attack surface"** carries a lot of weight. The more message types and extension specs an IKE negotiation has to handle, the higher the risk that a bug is hiding somewhere in the implementation—and in practice, both strongSwan and OpenVPN have had a history of multiple serious vulnerabilities reported (some leading to remote code execution or denial of service). WireGuard's deliberate elimination of choice among cryptographic algorithms, and its drastically minimized codebase, is a design decision that clearly reflects this "complexity equals attack surface" lesson. The fact that it went through review by prominent cryptographers and security researchers on its way into the Linux kernel proper backs up the real-world effectiveness of this design philosophy.

### Performance Characteristics: User-Space vs. Kernel-Space Implementations

VPN implementations broadly split into those running outside the OS kernel (user space) and those running inside it (kernel space). OpenVPN is a user-space implementation, so every packet it processes incurs a context switch and memory copy between the kernel and user space. WireGuard, by contrast, is a kernel-space implementation built directly into the Linux kernel, so this back-and-forth overhead is much smaller—which tends to give it an edge in both throughput and latency under equivalent conditions. IPsec (whether L2TP/IPsec or IKEv2/IPsec) can also take advantage of kernel-space crypto processing on many OSes (frameworks such as XFRM), so the general trend is that IPsec-family protocols and WireGuard tend to outperform OpenVPN on the performance front.

### Selection Criteria for Enterprise Deployment

No protocol is "unconditionally the best"—the right answer depends on your requirements.

| Selection Criterion | Best-Fit Protocol | Why |
|---|---|---|
| Wanting to operate using only the standard clients built into Windows/iOS/macOS/Android | IKEv2/IPsec | No need to install additional client apps, and it tends to receive long-term support as a native OS feature |
| Prioritizing connectivity from restrictive networks (hotels, public Wi-Fi, etc.) | OpenVPN (configured for TCP 443) | Can disguise itself as ordinary HTTPS traffic, making it easier to connect even where UDP/ESP is blocked |
| Prioritizing top performance and a simple setup in a self-hosted environment | WireGuard | Simple, fast implementation with few configuration items and low operational overhead |
| Stuck with an existing commercial VPN appliance that only supports L2TP/IPsec | L2TP/IPsec (certificate-based authentication + Main Mode mandatory) | Keeps existing assets in use while operating in a configuration that avoids the known weaknesses |

**Even if you can't immediately replace an existing L2TP/IPsec environment**, most of its known weaknesses can be mitigated in practice by moving away from a shared pre-shared key toward certificate-based authentication and by pinning IKE Phase 1 to Main Mode. In many cases, hardening the weak points of the current setup takes priority over a wholesale protocol migration.

## Common Misconceptions and Pitfalls

- **Misconception 1: "You should always pick the newer protocol."**
  Even though WireGuard is technically elegant, it has no built-in specification for standard user authentication (username/password login management) or enterprise-grade centralized management features, meaning it may not, on its own, satisfy the access-management requirements of a large organization (this is exactly why commercial implementations built on top of WireGuard exist that add IdP integration and user-management features). You should choose based on fit for your requirements, not novelty alone.
- **Misconception 2: "L2TP/IPsec is dangerous now and should never be used."**
  This is an extreme conclusion. With the right configuration—certificate-based authentication, strictly enforcing Main Mode—it's entirely possible to achieve adequate security in practice. "The design leaves a lot of room to end up choosing an insecure configuration" and "it's always insecure" are two different claims.
- **Misconception 3: "WireGuard has no concept of user authentication whatsoever."**
  WireGuard itself only has a mechanism for device authentication based on a public-key pair, and it's true that the concept of "logging in with a username and password" isn't part of its specification. But this is a deliberate design trade-off—if needed, user-level authentication and management features can be layered on by combining it with a wrapper implementation or commercial service that integrates with an external identity provider (IdP).

## Troubleshooting Perspective

Trouble during a protocol migration or connectivity issues on mobile networks are best approached by asking **"which event is this particular protocol's design weak against?"**

1. **Connection failures in an environment where protocols are mixed during a migration period**: If some clients use the old protocol (L2TP/IPsec) and others use the new one (e.g., IKEv2/IPsec), check whether both protocols are enabled simultaneously on the VPN server side, and whether the corresponding firewall rules (UDP 500/1701/4500, or IKEv2-specific settings) are correctly separated for each.
2. **Frequent disconnects when switching between mobile data and Wi-Fi**: Under IKEv1-based IPsec without MOBIKE support (including L2TP/IPsec), every IP address change tends to trigger a full reconnection from Phase 1, which is often perceived by the user as a disconnect. Whether switching to IKEv2 (with MOBIKE enabled) or WireGuard improves the situation is one useful diagnostic signal.
3. **Unable to connect only from certain networks (hotels, cafes, etc.)**: This strongly suggests UDP or ESP (protocol number 50) is being blocked. Whether a configuration that can "disguise itself as ordinary HTTPS traffic," like OpenVPN over TCP 443, is available makes a real difference in connectivity in these environments.

### Prevention and Long-Term Countermeasures

- When building a new remote-access VPN, choose a protocol only after clarifying your requirements (client types, network environment constraints, operational overhead), and prioritize a mobility-resilient configuration (IKEv2 + MOBIKE, or WireGuard) where possible.
- If an existing L2TP/IPsec environment can't be replaced right away, prioritize switching to certificate-based authentication and strictly enforcing Main Mode.
- During a transition period where multiple protocols run in parallel, extend monitoring and log collection to cover all of them, so a failure in one doesn't go unnoticed while attention stays on the other.

## Summary

- L2TP/IPsec's "legacy" status rests on the complexity of implementation and operations that comes from combining independent standards after the fact, its weakness under IP address changes on mobile networks, and known weaknesses around key exchange and authentication.
- IKEv2/IPsec extends IPsec's own standard specification (EAP authentication, Configuration Payload, MOBIKE) to deliver a complete remote-access VPN without going through L2TP, gaining mobile resilience along the way.
- OpenVPN is a consistent design built on TLS, and excels at firewall traversal (such as disguising itself over TCP 443), but pays an overhead cost for being a user-space implementation.
- WireGuard shrinks its attack surface by fixing its cryptographic algorithms and minimizing its implementation size, and achieves both mobile resilience and performance through public-key-based peer identification.
- Which protocol is optimal depends on your requirements—novelty alone isn't a good selection criterion. An existing L2TP/IPsec environment can also achieve adequate security in practice with the right configuration.

**Starting Today**
1. When selecting or reevaluating a VPN protocol, organize your requirements along three axes—client types, network environment constraints, and whether mobile usage is involved—before comparing options.
2. If an L2TP/IPsec environment is still in place, don't wait for a full migration—start with the immediately effective steps: switching to certificate-based authentication and strictly enforcing Main Mode.

## References

- [Internet Key Exchange Protocol Version 2 (IKEv2) | RFC 7296](https://datatracker.ietf.org/doc/html/rfc7296)
- [IKEv2 Mobility and Multihoming Protocol (MOBIKE) | RFC 4555](https://datatracker.ietf.org/doc/html/rfc4555)
- [Extensible Authentication Protocol (EAP) | RFC 3748](https://datatracker.ietf.org/doc/html/rfc3748)
- [WireGuard: Next Generation Kernel Network Tunnel | WireGuard whitepaper](https://www.wireguard.com/papers/wireguard.pdf)
- [OpenVPN Community Resources](https://openvpn.net/community-resources/)
- [Security Architecture for the Internet Protocol | RFC 4301](https://datatracker.ietf.org/doc/html/rfc4301)
