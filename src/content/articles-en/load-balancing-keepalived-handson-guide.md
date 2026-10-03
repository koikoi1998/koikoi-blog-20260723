---
title: "A Top 1% Hands-On for Making Two HAProxy Servers Redundant With keepalived and Experiencing Automatic VIP Failover"
description: "Use keepalived to make two HAProxy servers redundant in an Active/Standby configuration, sharing a single VIP. Deliberately stop the active unit and watch, with your own eyes via tcpdump and the ip addr command, Gratuitous ARP hand off the VIP to the standby unit automatically within seconds."
series: "load-balancing"
subSeries: "handson"
order: 9
tags: ["load-balancing", "keepalived", "vrrp", "haproxy", "handson", "infra"]
emoji: "🔁"
pubDate: 2026-10-05
---

## Introduction

- **What You'll Learn From This Article**: Verify what you learned in [VRRP and keepalived](/en/articles/load-balancing-vrrp-keepalived-guide) by **actually making two HAProxy servers redundant with keepalived, and watching, with your own eyes, the VIP get automatically handed off to the standby unit when the active unit is stopped.**
- **Intended Audience**: Readers who understand VRRP and keepalived in theory, but have never built it themselves, and want to confirm exactly how many seconds the VIP switchover takes and how it actually happens.
- **Estimated Reading Time**: About 25 minutes, including the hands-on exercise

This article is part of the [Top 1% Series Complete Article Guide](/en/sitemap), and the ninth article in the [Load Balancing Fundamentals Series](/en/sitemap#series-list). You can follow along with two of the Ubuntu Server environments set up in the [Hands-On Prep Manual](/en/articles/handson-prep-guide) (set these up separately from the backend servers used in [the HAProxy hands-on](/en/articles/load-balancing-haproxy-handson-guide)).

## Prerequisite Knowledge

- **VRRP and keepalived**: Read [Load Balancer Redundancy Itself](/en/articles/load-balancing-vrrp-keepalived-guide) first.
- **HAProxy's Basic Configuration**: This builds on the configuration from [the HAProxy hands-on](/en/articles/load-balancing-haproxy-handson-guide).

## Getting the Big Picture

This hands-on covers four steps.

```mermaid
graph LR
    Step1["Step 1<br/>Install HAProxy<br/>on both servers"]
    Step2["Step 2<br/>Configure keepalived and<br/>assign a shared VIP"]
    Step3["Step 3<br/>Confirm which unit<br/>is currently Master"]
    Step4["Step4<br/>Stop the Master and<br/>confirm failover"]
    Step1 --> Step2 --> Step3 --> Step4
```

## Hands-On Steps

### Step 1: Install HAProxy on Both Servers

On both of your Ubuntu Server machines (say, `10.0.0.21` and `10.0.0.22`), install HAProxy.

```bash
sudo apt update
sudo apt install -y haproxy
```

Append a simple configuration to `/etc/haproxy/haproxy.cfg` for verification (identical content on both servers).

```
frontend http_front
    bind *:80
    default_backend http_back

backend http_back
    server local 127.0.0.1:8080 check
```

Start a simple web server on both machines, for verification.

```bash
mkdir -p /tmp/web && echo "Response from $(hostname)" > /tmp/web/index.html
cd /tmp/web && nohup python3 -m http.server 8080 &
sudo systemctl restart haproxy
```

### Step 2: Install and Configure keepalived on Both Servers

```bash
sudo apt install -y keepalived
```

On **server 1** (Master, say `10.0.0.21`), create the following in `/etc/keepalived/keepalived.conf`.

```
vrrp_instance VI_1 {
    state MASTER
    interface eth0
    virtual_router_id 51
    priority 150
    advert_int 1
    authentication {
        auth_type PASS
        auth_pass lb_lab_secret
    }
    virtual_ipaddress {
        10.0.0.100/24
    }
}
```

On **server 2** (Backup, say `10.0.0.22`), create the following, with only `state` and `priority` changed.

```
vrrp_instance VI_1 {
    state BACKUP
    interface eth0
    virtual_router_id 51
    priority 100
    advert_int 1
    authentication {
        auth_type PASS
        auth_pass lb_lab_secret
    }
    virtual_ipaddress {
        10.0.0.100/24
    }
}
```

**The server with the higher priority value becomes Master preferentially.** As covered in [the previous article](/en/articles/load-balancing-vrrp-keepalived-guide), `virtual_router_id` must match exactly across every server in the same VRRP group. Start the service on both servers.

```bash
sudo systemctl enable --now keepalived
```

<details>
<summary>Why Is the `auth_pass` Setting Necessary?</summary>

VRRP's liveness packet (the Advertisement) gets broadcast or multicast within the same network. Without the lightweight authentication `auth_pass` provides, **you'd risk accepting an Advertisement from an unrelated VRRP group elsewhere on the same network, or a forged one sent by a malicious third party, triggering an unintended failover.** This hands-on uses simple plaintext authentication (PASS), but in a genuine production environment, the more robust fix, as covered in [the previous article](/en/articles/load-balancing-vrrp-keepalived-guide), is isolating VRRP's own liveness-check communication path onto a dedicated network.

</details>

### Step 3: Confirm Which Server Is Currently Master

On server 1 (presumed Master), confirm the VIP is actually assigned to it.

```bash
ip addr show eth0
```

**Output (relevant part):**

```
inet 10.0.0.21/24 ...
inet 10.0.0.100/24 scope global secondary eth0
```

You can confirm server 1 has the VIP (`10.0.0.100`) attached **as a `secondary`**, alongside its ordinary IP address (`10.0.0.21`). Running `ip addr show eth0` on server 2 shows no VIP at all.

From a different machine on the network, try accessing the VIP.

```bash
curl http://10.0.0.100/
```

**Output:**

```
Response from lb01
```

You confirmed server 1's (Master's) hostname comes back in the response.

### Step 4: Stop the Master and Confirm Failover

On server 2 (Backup), monitor VRRP's liveness packets while stopping server 1.

**Run on server 2 (to monitor):**

```bash
sudo tcpdump -i eth0 vrrp
```

**From a different machine, stop keepalived on server 1:**

```bash
ssh 10.0.0.21 "sudo systemctl stop keepalived"
```

Watching server 2's tcpdump output, you can see that after server 1's Advertisements stop arriving, server 2 itself starts sending Advertisements within a few seconds.

On server 2, check the VIP's state.

```bash
ip addr show eth0
```

**Output (relevant part):**

```
inet 10.0.0.22/24 ...
inet 10.0.0.100/24 scope global secondary eth0
```

**The VIP has been handed off to server 2.** Try accessing the VIP again.

```bash
curl http://10.0.0.100/
```

**Output:**

```
Response from lb02
```

**You confirmed the responding server switched from server 1 to server 2, with the client side never noticing a thing — its connection target stays exactly `10.0.0.100`, unchanged.** This is [Gratuitous ARP's instant switchover at the network layer](/en/articles/load-balancing-vrrp-keepalived-guide), actually doing its job.

Try running `sudo systemctl start keepalived` on server 1 to bring it back, and confirm it reclaims the Master role again, thanks to its higher priority value.

## What a Pro Sees Here (Top 1% Understanding)

### Failover Speed Is Directly Tied to What's Actually Switching Over

The failover you confirmed in Step 4 completed in just a few seconds. As covered in [the previous article](/en/articles/load-balancing-vrrp-keepalived-guide), this is because **VRRP never rewrites a DNS answer — it directly rewrites the VIP's actual location, at the network layer.** In contrast to [GSLB's](/en/articles/load-balancing-gslb-guide) data-center-level failover carrying a minutes-long delay tied to DNS TTL, a VRRP switchover within the same network completes in seconds. The point of this hands-on is to let you feel firsthand how a difference in **which layer the mechanism actually operates at** shows up as a concrete difference in how fast the failover actually is.

## Common Misconceptions and Pitfalls

- **Misconception 1: "Just installing keepalived automatically assigns the VIP."**
  You need to correctly configure `virtual_ipaddress` and the interface name in `keepalived.conf`.
- **Misconception 2: "The priority value should be set the same on both servers."**
  If priority is equal on both, it becomes undefined which one should actually become Master. You need a clear difference between them.
- **Misconception 3: "After a failover, the client side needs some kind of reconnection setting."**
  Since the VIP's IP address itself never changes, the client side needs no changes at all. That's exactly the value the VIP design provides.

## Troubleshooting Perspective

1. **Neither server shows the VIP with `ip addr show`**: Check the `virtual_ipaddress` setting in `keepalived.conf`, and check `systemctl status keepalived` to confirm the service actually started correctly.
2. **Both servers show the VIP at the same time (split-brain)**: Check whether `virtual_router_id` matches on both servers, and check whether VRRP's liveness packets are actually arriving (confirm with `tcpdump`).
3. **Recovering the Master unit doesn't restore its Master role**: Check whether `nopreempt` is set in `keepalived.conf`. With this setting present, a higher priority value won't automatically reclaim the role.

## Summary

- Configuring `state`, `priority`, and `virtual_ipaddress` in keepalived's `keepalived.conf` lets multiple HAProxy servers share one VIP.
- The server with the higher priority value becomes Master preferentially, holding the VIP.
- When the Master unit goes down, the VIP automatically hands off to the Backup unit within seconds, with the client side never needing to notice any change to its connection target.
- This fast failover is achieved by directly rewriting the VIP's actual location at the network layer, never by rewriting DNS.

**Takeaways to Apply Today**
1. When configuring keepalived, set a clear difference in the priority value, deliberately pinning the Master/Backup roles.
2. When verifying failover speed, build the habit of actually observing VRRP packets with `tcpdump` and confirming the mechanism with your own eyes.

## References

- [Keepalived Documentation](https://www.keepalived.org/manpage.html)
- [RFC 5798 - Virtual Router Redundancy Protocol (VRRP) Version 3](https://datatracker.ietf.org/doc/html/rfc5798)
