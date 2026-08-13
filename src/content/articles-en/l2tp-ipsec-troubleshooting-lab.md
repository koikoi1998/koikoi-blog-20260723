---
title: "L2TP/IPsec Troubleshooting Lab: Diagnosing Real Failures from Error Logs, a \"Top 1%\" Hands-On Exercise"
description: "Using the environment from the L2TP/IPsec hands-on lab, this exercise deliberately reproduces five real-world failures and asks you to diagnose and fix each one yourself, using nothing but journalctl output as your guide. Practicing the process of investigating before looking at the answer builds the practical debugging skill you need when a config doesn't behave the way requirements say it should."
series: "vpn"
order: 5
tags: ["network", "vpn", "l2tp", "ipsec", "troubleshooting", "handson"]
emoji: "🩺"
pubDate: 2026-08-10
---

## Introduction

- **What You'll Learn From This Article**: Using the environment you already built by following the [L2TP/IPsec hands-on lab](/en/articles/l2tp-ipsec-lab-guide), you'll deliberately reproduce five failures that come up often in practice. For each one, instead of jumping straight to the answer, you'll practice forming a hypothesis and confirming it with nothing but `journalctl` output. The five failures used here are ones actual readers of this blog ran into while working through that lab.
- **Intended Audience**: Anyone who's already completed the [L2TP/IPsec hands-on lab](/en/articles/l2tp-ipsec-lab-guide) once and still has a working environment around. If you haven't done that yet, finish it first.
- **Estimated Reading Time**: About 60 minutes (if you actually work through diagnosing each scenario)

**About this article**: A conventional step-by-step hands-on lab is really an exercise in "copy the correct config and it works." In practice, though, you need the skill to **choose your own values based on requirements, and when something breaks, investigate and fix it yourself.** This article is built to train exactly that skill. This article is part of the [Top 1% Series' full article guide](/en/sitemap).

## How to Work Through This Exercise

Each scenario follows the same four-part structure.

1. **Symptom**: What you'd actually observe (the command you ran, and its result)
2. **Investigation hint**: A pointer toward which command/log to check — not the answer itself
3. **The answer, inside a `<details>` block**: The actual cause and fix. **We strongly recommend spending at least a minute or two investigating on your own before opening it.**
4. **Lesson**: The generalizable insight this failure teaches, applicable beyond this one scenario

If you're not yet confident with the mechanics of error investigation itself (`journalctl`'s `-u`/`-t`/`-f`, etc.), reading [Investigating Error Logs with journalctl](/en/articles/linux-journalctl-guide) first will make this exercise go much more smoothly.

## Scenario 1: `xl2tpd` won't start

On the client (or server), un-comment the relevant section of `/etc/xl2tpd/xl2tpd.conf` as shown below, then run `systemctl restart strongswan-starter xl2tpd`.

```
;[lac L2TPLab]
lns = <server's IP address>
ppp debug = yes
pppoptfile = /etc/ppp/options.l2tpd.client
length bit = yes
```

```bash
sudo systemctl restart strongswan-starter xl2tpd
```

**Symptom**: `xl2tpd` fails to start with an error like this.

```
Job for xl2tpd.service failed because the control process exited with error code.
See "systemctl status xl2tpd.service" and "journalctl -xeu xl2tpd.service" for details.
```

**Investigation hint**: Run `journalctl -xeu xl2tpd.service` as suggested. Look for a line containing the word `parse_config`.

<details>
<summary>Show the answer</summary>

Running `journalctl -xeu xl2tpd.service` shows a message like `parse_config: line NN: data '...'`, indicating the config file failed to load. The cause: the `[lac L2TPLab]` line still had a leading `;` (comment marker). With it left in, xl2tpd's config parser treats the entire section as if it doesn't exist, so subsequent lines like `lns = ...` become meaningless too (their parent section is commented out). Remove the `;` and re-run `sudo systemctl restart strongswan-starter xl2tpd` to fix it.

</details>

**Lesson**: `xl2tpd.conf` ships by default with a huge block of sample lines commented out with `;`. When you copy and edit an existing line, always double-check whether you forgot to strip that leading `;`.

## Scenario 2: `ipsec`/`xl2tpd` are up, but `ppp0` never appears (case 1)

On the server, add `lock` back into `/etc/ppp/options.xl2tpd` as shown (deliberately re-introducing it for this exercise).

```
require-mschap-v2
ms-dns 8.8.8.8
ms-dns 1.1.1.1
asyncmap 0
auth
crtscts
idle 1800
mtu 1410
mru 1410
nodefaultroute
debug
lock
proxyarp
connect-delay 5000
```

Restart the services and try connecting from the client.

**Symptom**: `sudo ipsec statusall` correctly shows the IKE/IPsec SA as `ESTABLISHED`, but on the client, `ip a show ppp0` never shows a `ppp0` interface. No obvious error message jumps out at first glance.

**Investigation hint**: If `xl2tpd`'s own log (`journalctl -u xl2tpd`) shows nothing clearly wrong, check the log of the other program `xl2tpd` launches as a child process — using `-t` instead of `-u`. Try this on both the server and the client.

<details>
<summary>Show the answer</summary>

Running `sudo journalctl -t pppd -n 30 --no-pager` on the server shows the `pppd` process exiting without a clear error message, right after `Plugin pppol2tp.so loaded.`. The cause is `lock` in `options.xl2tpd`. `lock` tells pppd to create a lock file for the serial device it's using, but a `pppol2tp`-based connection has no real device to lock in the first place. That mismatch keeps pppd from starting properly. Remove the `lock` line and restart to fix it.

</details>

**Lesson**: A "silent failure" — one that produces no error message at all — can't always be found by searching log text. This is a textbook case where you need the more tedious approach of removing suspect settings one at a time and comparing.

## Scenario 3: `ipsec`/`xl2tpd` are up, but `ppp0` never appears (case 2)

This time, temporarily rename the file `pppoptfile` points to in the server's `/etc/xl2tpd/xl2tpd.conf` (`/etc/ppp/options.xl2tpd`), e.g. with `sudo mv /etc/ppp/options.xl2tpd /etc/ppp/options.xl2tpd.bak`, to simulate it being missing.

**Symptom**: Same as Scenario 2 — `ipsec statusall` looks fine, but `ppp0` never appears.

**Investigation hint**: Use the same investigation steps as Scenario 2 (`journalctl -t pppd`), and read the message carefully. This time, you'll get a clear, plain-English error.

<details>
<summary>Show the answer</summary>

`sudo journalctl -t pppd -n 30 --no-pager` (on the server) shows a clear message: `Can't open options file /etc/ppp/options.xl2tpd: No such file or directory`. The direct cause is that the file path specified by `pppoptfile` in `xl2tpd.conf` doesn't exist. Rename the file back (or recreate it) to fix it.

</details>

**Lesson**: `xl2tpd.conf` is just instructions for how to launch `pppd` — `pppd` itself is what actually interprets the PPP options. Since they're separate processes with separate logs, a misconfiguration on the `xl2tpd` side can end up only visible in `pppd`'s log. Keep that in mind.

## Scenario 4: IKE fails with `NO_PROPOSAL_CHOSEN`

On the client, deliberately add a space after the commas in `/etc/ipsec.conf`'s `ike=` value, like this.

```
ike=aes256-sha1-modp1024, aes128-sha1-modp1024, 3des-sha1-modp1024!
```

Run `sudo systemctl restart strongswan-starter`, then try `sudo ipsec up L2TP-PSK`.

**Symptom**: The connection fails with an error like this.

```
received NO_PROPOSAL_CHOSEN error notify
establishing connection 'L2TP-PSK' failed
```

**Investigation hint**: Compare the `ike=` value character by character. After fixing it and restarting `strongswan-starter`, don't just suspect the client — check the state of the **server** too.

<details>
<summary>Show the answer</summary>

The cause is the space after the comma in `ike=`. strongSwan's cipher-suite list is parsed strictly on commas, so an entry containing a space gets treated as an invalid algorithm name, and the entire proposal is rejected. Simply removing the space and restarting `strongswan-starter` on the client alone may not fix it. That's because editing a config file doesn't instantly take effect on the running charon daemon, and state from a previously failed negotiation can linger inside it. **Restarting `strongswan-starter` on the server as well as the client** makes both sides start a clean negotiation from the new config, and resolves it.

</details>

**Lesson**: Some bugs won't reproduce as fixed until you clean up the state of the running daemon, not just the config file — and especially both ends of a connection, not just the one you edited. If fixing "your" side alone doesn't help, suspect the peer's state too.

## Scenario 5: Only the Windows client can't connect

On the server, revert `/etc/ppp/chap-secrets` from the wildcard setup (`labuser * "password" *`) back to a hard-coded server name, like this.

```
# client        server  secret                    IP addresses
labuser         L2TPLab "a sufficiently strong password"      *
```

With this in place, try connecting from Windows' built-in VPN settings (a Linux client is unaffected by this change and will still connect successfully).

**Symptom**: Windows shows an error like this and fails to connect.

```
The remote computer could not be reached... the port used for this connection is closed.
```

**Investigation hint**: Run `sudo journalctl -t pppd -f` on the server while retrying the connection from Windows. Watch for any message about something not being "found."

<details>
<summary>Show the answer</summary>

The server's `pppd` log shows `couldn't find any suitable secret (password)`. Because the second field (server name) in `chap-secrets` was hard-coded to `L2TPLab`, it didn't match whatever value the Windows RRAS client presented as its own identity, so the secret lookup failed (this is easy to miss because it happens to match for the Linux CLI client via xl2tpd, so that side "just works"). Changing the server-name field to `*` (wildcard) lets the same entry authenticate regardless of how a given client identifies itself.

</details>

**Lesson**: When the same server accepts several different kinds of clients (a Linux CLI client, a Windows RRAS client, etc.), a config validated against only one of them can break in unexpected ways for the other. Where possible, test with each type of client you actually expect to support.

## The View from the Top 1% (What Experts See): Having a Repeatable Process for Incident Response

Looking back over all five scenarios, the investigative pattern is the same every time.

1. **State the symptom precisely**: Not "it doesn't work," but "`ipsec statusall` shows ESTABLISHED, but `ppp0` never appears" — narrow down exactly where things stop being normal.
2. **Confirm each stage that should normally pass (IKE → L2TP → PPP), one at a time, with logs**: This is where the `-u`/`-t` distinction and investigation order from [Investigating Error Logs with journalctl](/en/articles/linux-journalctl-guide) pays off.
3. **Treat "no error appeared" as information too**: When there's no clear error message, switch to the experimental approach of removing suspect settings one at a time.
4. **After fixing something, restart and re-verify both ends involved, not just the one you changed**: Especially for bidirectional negotiations like key exchange, fixing only one side can leave the two ends in mismatched states.

Being able to choose your own config values based on requirements, and when something breaks, investigate it yourself using this same repeatable process — that's what turns the [L2TP/IPsec hands-on lab](/en/articles/l2tp-ipsec-lab-guide) from "an exercise in following steps" into "practical, applicable experience."

## Summary

- Forgetting to uncomment `xl2tpd.conf`, the `lock` option in `options.xl2tpd`, a wrong `pppoptfile` path, a stray space in `ike=`, and a hard-coded server name in `chap-secrets` are all reproducible failures that really happened during this hands-on lab.
- The basic investigation pattern is to follow the connection-establishment order (IKE → L2TP → PPP) and check logs in that same order: `ipsec statusall` → `journalctl -u xl2tpd` → `journalctl -t pppd`.
- A "silent failure" with no error message may require the more tedious experimental approach — removing suspect settings one at a time and comparing.

**Starting Today**
1. Don't memorize the answers — internalize the process itself: form a hypothesis from the symptom, then confirm it with logs. Failures you meet in practice won't look exactly like any of these five.
2. When you hit a config that doesn't behave, reframe it: it's not noise getting in the way of learning — it's the best opportunity you'll get to build practical debugging skill.

## References

- [journalctl(1) — Linux manual page](https://man7.org/linux/man-pages/man1/journalctl.1.html)
- [strongSwan Documentation](https://docs.strongswan.org/)
- [xl2tpd | Linux man-pages](https://man7.org/linux/man-pages/man8/xl2tpd.8.html)
