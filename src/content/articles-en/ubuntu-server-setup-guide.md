---
title: "Hands-On Prep Manual: Setting Up an Ubuntu Server for the First Time — Post-Login Basics and Enabling SSH"
description: "A prep manual covering the basic operations you'll reach for right after your first login to an Ubuntu Server VM built on Proxmox VE: what sudo apt update actually does, switching to root with sudo su -, the basics of the nano editor, the US-keyboard-layout gotcha, and how to check for and install an OpenSSH server."
series: "handson-prep"
order: 2
tags: ["ubuntu", "linux", "handson", "beginner", "ssh", "infrastructure"]
emoji: "🐧"
pubDate: 2026-08-10
---

## Introduction

- **What You'll Learn From This Article**: After your first login to the Ubuntu Server VM you built in [Creating a VM in Proxmox VE and Installing an OS](/en/articles/handson-prep-guide), you'll pick up the basic operations used throughout this blog's hands-on articles (`sudo apt update`, `sudo su -`, `nano`), the US-keyboard-layout gotcha, and how to check for and enable an SSH server.
- **Intended Audience**: Anyone completely new to operating a Linux server who's about to start working through this blog's hands-on articles.
- **Estimated Reading Time**: About 15 minutes

This article is part of the [Top 1% Series' full article guide](/en/sitemap), one of the theme-specific articles split off from the [hands-on prep manual](/en/articles/handson-prep-guide). Using the terminal client software you connect over SSH with is covered in [How to Use Teraterm (a Terminal Client)](/en/articles/teraterm-guide).

## Checking for and Enabling the SSH Server

If you already checked "Install OpenSSH server" during the Ubuntu Server install in [the previous article](/en/articles/handson-prep-guide), skip this section and go straight to "Logging In for the First Time" below. If you forgot to check it, or you want to SSH into a VM that's already running, log into the VM directly via Proxmox's "Console" tab and install the SSH server with the following steps.

```bash
sudo apt update
sudo apt install -y openssh-server
```

After installing, confirm the service is running and set to start automatically on future reboots.

```bash
sudo systemctl status ssh
sudo systemctl enable --now ssh
```

`enable --now` is a combination that both starts the service immediately and sets it to start automatically going forward. If you have a firewall (`ufw`) enabled, you'll also need to allow the SSH port (TCP 22 by default).

```bash
sudo ufw allow OpenSSH
```

At this point, you can connect from your own PC with `ssh <username>@<VM's IP address>`. If you don't know the VM's IP address, run `ip a` from the console to find it.

## Logging In for the First Time and Common Basic Operations

After rebooting, SSH into the VM over the network.

```bash
ssh <the username you set during installation>@<VM's IP address>
```

### What `sudo apt update` actually does

Ubuntu/Debian-family Linux distributions install, update, and remove software with a package management command called `apt`. `apt` works off the repository information registered in `/etc/apt/sources.list` (and under `/etc/apt/sources.list.d/`) — essentially, "which servers offer which software."

```bash
sudo apt update
```

This command **does not actually install or update any software.** It only queries each repository and refreshes the local cache of "the currently available packages and their versions" (the package index). If you skip this "refresh the info" step first, the command that actually installs software, `sudo apt install <package name>`, ends up working off stale information — it might look for a version that no longer exists, or fail to resolve the latest dependencies. That's why **"run `sudo apt update` before installing anything"** is the standard rule of thumb.

<details>
<summary>The difference between apt update / apt upgrade / apt install</summary>

- `sudo apt update`: Fetches only the "list of available packages" from the repositories and refreshes the local cache (installs or changes nothing).
- `sudo apt upgrade`: Actually upgrades any currently installed package that has a newer version available in the information `apt update` fetched.
- `sudo apt install <package name>`: Installs the specified package fresh (or upgrades it, if it's already installed).

The clear separation between "fetching information" (update) and "actually making changes" (upgrade/install) as distinct commands is a defining trait of `apt` compared to other OSes' package management.

</details>

### Becoming root with `sudo su -`

Prefixing a command with `sudo` lets the regular user account you created during Ubuntu's install run that one command with administrator (root) privileges. But if you want to run several commands in a row as root, prefixing every single one with `sudo` gets tedious. That's what this command is for.

```bash
sudo su -
```

`su` stands for switch user, and with no argument, it means switching to root. **Pay attention to whether you add the trailing `-` (hyphen) or not — the behavior differs.**

- `sudo su` (no hyphen): Switches to root, but keeps the original user's environment variables (like `PATH` and the current directory).
- `sudo su -` (with hyphen): Switches to root **and resets the environment variables to the same state as if root had logged in directly.** The home directory also changes to `/root`.

In most cases, working in root's own proper environment avoids unexpected PATH-related issues, so **using `sudo su -` with the hyphen is the common convention.** When you're done, type `exit` or press `Ctrl+D` to return to your original user.

<details>
<summary>Aside: sudo or su — which should you use?</summary>

In practice, **prefixing only the specific commands you need with `sudo` is generally recommended over living in a persistent root shell via `su`.** The reason: commands run with `sudo` tend to leave a record in places like `/var/log/auth.log` of who did what and when, making auditing (tracing who did what) easier. Staying parked in a root shell via `sudo su -` makes the commands you run afterward harder to trace individually. This is why so many of this blog's hands-on articles prefix each command with `sudo` rather than dropping into a root shell.

</details>

### The basics of the `nano` editor

This blog's hands-on articles use `nano`, a beginner-friendly text editor, to edit config files like `/etc/ipsec.conf`.

```bash
sudo nano /etc/ipsec.conf
```

When `nano` starts, a list of shortcuts appears at the bottom of the screen. `^` means the Ctrl key (e.g., `^O` is Ctrl+O).

| Shortcut | Action |
|---|---|
| `Ctrl + O` | Save (Write Out). You'll be asked for a filename to save to — usually you can just press Enter to accept the default |
| `Ctrl + X` | Exit. If there are unsaved changes, you'll be asked whether to save them |
| `Ctrl + W` | Search text (Where Is) |
| `Ctrl + K` | Cut the current line |
| `Ctrl + U` | Paste (Uncut) whatever you last cut |
| Arrow keys | Move the cursor |

If you want to exit without saving (say, after an accidental edit), press `Ctrl + X`, and when asked whether to save, choose `N` (No) to discard the changes and exit.

## The US-Keyboard-Layout Gotcha

If you chose "English (US)" as the keyboard layout during the Ubuntu Server install, **and your physical keyboard has a Japanese layout, what's printed on the keys may not match what actually gets typed.** That's because the physical layout of a keyboard (where the keys are) and how the OS interprets a given keypress as a character (the logical layout setting) are two separate concepts.

Here are the most common discrepancies (they vary a bit by keyboard model).

| Symbol you want to type | Corresponding key on a Japanese layout | Gotcha with a US layout |
|---|---|---|
| `=` (equals) | A dedicated key to the right of `-` | Often mapped to `Shift + -` (shift of the hyphen key) under a US layout, with a different symbol appearing where the dedicated `=` key would be |
| `"` (double quote) | Shift of the `2` key | Mapped to shift of the `'` (single quote) key under a US layout |
| `@` (at sign) | Shift of the `2` key (sometimes the same key as `"` on a Japanese layout) | A different key position under a US-layout keyboard |
| `_` (underscore) | Near the `ろ` key, or shift of `-` | Consistently mapped to shift of `-` under a US layout |

**The most reliable fix is to match the OS's keyboard layout setting to "Japanese" if your physical keyboard has a Japanese layout.** If you accidentally chose "English (US)" during installation, you can change it afterward with this command.

```bash
sudo dpkg-reconfigure keyboard-configuration
```

An interactive configuration screen appears — choose a generic "Keyboard model," and set "Country of origin" to "Japan" to get printed-symbol-matching input on a Japanese-layout keyboard. After changing the setting, log out and back in, or run `sudo systemctl restart console-setup`, to apply it.

<details>
<summary>Why a US layout is so often the default guidance</summary>

Many Linux distributions' installers and technical documentation default to assuming an "English (US)" layout, and getting comfortable with a US layout has its own practical upside for infrastructure engineers who frequently search and reference technical information originating overseas. That said, there's no need to burn energy on symbol-input mistakes while you're still learning — it's perfectly fine to **start by matching your physical keyboard with a Japanese layout, and try a US layout once you're more comfortable.**

</details>

## Summary

- If the SSH server (`openssh-server`) isn't installed, install it with `sudo apt install -y openssh-server`, then enable it to start (and auto-start) with `sudo systemctl enable --now ssh`.
- `sudo apt update` isn't an "install" — it's a "refresh of the available package information" — and running it before installing anything is the standard rule of thumb.
- `sudo su -` switches you to a root shell, but in practice, prefixing each command with `sudo` instead is recommended for easier auditing.
- Matching your keyboard layout setting (Japanese or US) to your actual physical keyboard avoids confusion when typing symbols.

## References

- [Ubuntu Server documentation — OpenSSH](https://ubuntu.com/server/docs/openssh-server)
- [GNU nano — Documentation](https://www.nano-editor.org/dist/latest/nano.html)
- [sudo(8) — Linux manual page](https://man7.org/linux/man-pages/man8/sudo.8.html)
