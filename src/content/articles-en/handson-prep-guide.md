---
title: "Hands-On Prep Manual: From Creating a VM in Proxmox VE to Installing an OS, Plus the Basics of nano/sudo/apt update"
description: "A single prep manual covering everything this blog's hands-on articles need in common: creating a VM in Proxmox VE, downloading and installing the Ubuntu Server ISO, what sudo apt update actually does, switching to root with sudo su -, basic nano editor operation, and gotchas with a US keyboard layout — written for readers doing a hands-on lab for the very first time."
series: "handson-prep"
order: 1
tags: ["proxmox", "linux", "handson", "beginner", "infrastructure"]
emoji: "🧰"
pubDate: 2026-08-09
---

## Introduction

- **What You'll Learn From This Article**: The environment-setup basics needed in common across this blog's hands-on articles (like the self-built L2TP/IPsec server lab) — creating a VM in Proxmox VE, where to get the Ubuntu Server installer, what `sudo apt update` and `sudo su -` actually do after your first login, how to use the `nano` editor, and gotchas with a US keyboard layout.
- **Intended Audience**: Readers who are completely new to virtualization environments (like Proxmox VE) or operating a Linux server, and are about to start one of this blog's hands-on articles.
- **Estimated Reading Time**: About 20 minutes (longer if you're following along hands-on)

This article is part of the [Top 1% Series' full article guide](/en/sitemap). **This article is specifically an operations manual — a "warm-up" for readers about to start a hands-on lab — and doesn't cover internal mechanics the way the rest of the site does.** If you're curious how Proxmox VE actually works under the hood (KVM/QEMU, etc.), see [What Is Proxmox VE?](/en/articles/proxmox-internals-guide). Each hands-on article (for example, the [self-built L2TP/IPsec server lab](/en/articles/l2tp-ipsec-lab-guide)) assumes you can already do everything covered here.

## How to Use This Article

Each item below stands alone as a procedure you can come back to when you need it. Skip anything you already know.

1. Create a VM in Proxmox VE
2. Download an OS installer image (ISO) and upload it to Proxmox
3. Install an OS from the ISO (using Ubuntu Server as the example)
4. Common operations right after your first login (`sudo apt update`, `sudo su -`, `nano`)
5. Gotchas with a US keyboard layout

## Step 1: Create a VM in Proxmox VE

Log into Proxmox VE's management UI (in a browser, at `https://<Proxmox's IP address>:8006`), select the target node, and open the creation wizard from the **"Create VM"** button in the top right.

| Wizard tab | Main settings | Rule of thumb for a hands-on lab |
|---|---|---|
| General | VM ID, name | Give it a name that reflects the hands-on's content, so it's easy to identify later (e.g., `l2tp-server`) |
| OS | The ISO image to install from | Select the ISO you uploaded in Step 2 |
| System | BIOS type, whether to use the QEMU guest agent, etc. | The defaults are usually fine |
| Disks | Disk size, target storage | For lab purposes, 8–20GB is often plenty (follow whatever the specific article says) |
| CPU | Core count | For lab purposes, 1–2 cores is often plenty |
| Memory | Memory size (MB) | For lab purposes, about 1–2GB is often plenty |
| Network | Which bridge to attach to (usually `vmbr0`) | Choose `vmbr0` if you want it bridged directly to your home LAN |

Once you've reviewed every tab, click "Confirm" to finalize creation. The VM isn't running yet at this point.

## Step 2: Download and Upload an OS Installer Image (ISO)

**Download the ISO**: Get the installer ISO from the distributing OS's official site. For Ubuntu Server, for example, picking the LTS (long-term support) release from the [official Ubuntu download page](https://ubuntu.com/download/server) is the safe default.

**Upload it to Proxmox**: In Proxmox's management UI, pick the storage where you want to keep the ISO (usually `local`), then go to "ISO Images" → "Upload" and upload the file you downloaded. If "Download from URL" is available, letting Proxmox fetch the ISO directly by URL can be faster than uploading through your own connection.

## Step 3: Install an OS from the ISO (Using Ubuntu Server as the Example)

Select the VM you created in Step 1, click "Start," then open the "Console" tab to operate the VM's screen right in your browser (this uses a technology called noVNC, which streams the VM's display like a remote desktop).

Once the Ubuntu Server installer boots, the flow generally goes like this:

1. **Language selection**: Sticking with "English" is common (the Japanese UI has less documentation, and error messages staying in English makes them easier to search for).
2. **Keyboard layout selection**: Whatever you pick here affects both the rest of the install and how input is interpreted afterward. If your physical keyboard has a Japanese layout, selecting "Japanese" here lets you type exactly what's printed on the keycaps. Step 5 (Gotchas with a US Keyboard Layout) covers what happens if you pick "English (US)" here instead.
3. **Network configuration**: If `vmbr0` is bridged directly to your LAN, an IP address is usually assigned automatically via DHCP, and you can just continue.
4. **Storage configuration**: Unless you have a specific reason not to, following the default guidance (something like "Use an entire disk") is fine.
5. **Profile setup**: Set the server name, username, and password. The user you create here becomes the admin user who can use `sudo` after install.
6. **Installing OpenSSH Server**: Strongly recommend checking "Install OpenSSH server" here. This lets you connect to the VM over SSH once installation finishes (much easier to copy-paste with than the console screen), and every subsequent hands-on article assumes you're connecting over SSH.
7. **Featured server snaps**: Unless a specific hands-on article tells you to pick something, it's fine to select nothing here and continue (you'll install whatever you need individually with `apt` later).

You'll be prompted to reboot once installation finishes. **Don't forget to eject the ISO from the VM's optical drive (or change the boot order) before rebooting** — otherwise, the installer boots again on every restart (you can unmount the ISO from the VM's "Hardware" tab → CD/DVD drive in Proxmox).

## Step 4: Your First Login and Common Operations

After rebooting, SSH into the VM over the network (this works if you installed OpenSSH Server in Step 3).

```bash
ssh <the username you set in Step 3>@<the VM's IP address>
```

### What `sudo apt update` Actually Does

Ubuntu/Debian-family Linux installs, updates, and removes software using a package management command called `apt`. `apt` operates based on repository information registered in `/etc/apt/sources.list` (and under `/etc/apt/sources.list.d/`) — which servers to fetch which software from.

```bash
sudo apt update
```

This command **doesn't actually install or update any software.** It only queries each repository and refreshes the local cache of "the list of packages currently available, and their versions" (the package index). Skipping this "refresh the info first" step means `sudo apt install <package name>` — the command that actually installs software — ends up working off stale information, potentially looking for a version that no longer exists or failing to resolve the latest dependencies. That's why **"run `sudo apt update` before installing anything" is the standard rule of thumb.**

<details>
<summary>The difference between apt update / apt upgrade / apt install</summary>

- `sudo apt update`: Fetches just the "list of available packages" from the repositories and refreshes the local cache (installs or changes nothing).
- `sudo apt upgrade`: Among currently installed packages, actually upgrades any that have a newer version available in the info fetched by `apt update`.
- `sudo apt install <package name>`: Installs the specified package fresh (or upgrades it, if it's already installed).

The clean separation between "fetch information (update)" and "actually make a change (upgrade/install)" is a defining trait of `apt` compared to package management on other OSes.

</details>

### Becoming Root with `sudo su -`

The ordinary user you created during Ubuntu's install can run any single command with administrator (root) privileges by prefixing it with `sudo`. But if you want to run several commands in a row with root privileges, prefixing every single one with `sudo` gets tedious. That's what this command is for:

```bash
sudo su -
```

`su` stands for switch user, and omitting an argument means switching to root. **Note that whether you include the trailing `-` (hyphen) changes the behavior:**

- `sudo su` (no hyphen): Switches to root, but carries over the original user's environment variables (like `PATH` and the current directory).
- `sudo su -` (with hyphen): Switches to root **and resets the environment variables to match what they'd be if root had logged in directly.** The home directory also moves to `/root`.

In most cases, **`sudo su -` (with the hyphen) is the more common choice**, since working in root's actual environment avoids unexpected path-related issues. Type `exit` or press `Ctrl+D` when you're done, to return to your original ordinary user.

<details>
<summary>sudo vs. su: which should you use?</summary>

In practice, **prefixing just the commands you need with `sudo`, rather than staying in a root shell via `su`, is the recommended approach.** The reason: commands run via `sudo` leave a record in places like `/var/log/auth.log` of who ran what, and when — making auditing (tracing who did what) much easier. Sitting in a root shell via `sudo su -` makes the commands you run afterward much less individually traceable. This is why this blog's hands-on articles prefix nearly every command with `sudo` individually.

</details>

### Basic `nano` Editor Operation

This blog's hands-on articles use `nano`, a beginner-friendly text editor, for editing config files like `/etc/ipsec.conf`.

```bash
sudo nano /etc/ipsec.conf
```

When `nano` starts, a list of shortcuts appears along the bottom of the screen. `^` means the Ctrl key (e.g., `^O` means Ctrl+O).

| Shortcut | Action |
|---|---|
| `Ctrl + O` | Save (Write Out). You'll be asked to confirm the filename — usually just press Enter |
| `Ctrl + X` | Exit. If there are unsaved changes, you'll be asked whether to save them |
| `Ctrl + W` | Search for text (Where Is) |
| `Ctrl + K` | Cut the current line |
| `Ctrl + U` | Paste what you cut (Uncut/Paste) |
| Arrow keys | Move the cursor |

If you want to exit without saving (say, after accidentally editing something), press `Ctrl + X` and then choose `N` (No) when asked whether to save — this discards your changes and exits.

## Step 5: Gotchas with a US Keyboard Layout

If you selected "English (US)" as the keyboard layout during Ubuntu Server's install, and your physical keyboard has a **Japanese layout**, **the character printed on a keycap and the character that's actually typed can differ.** This is because a keyboard's physical layout (where the keys are) and how the OS interprets a given keypress (the logical layout setting) are two separate concepts.

Some of the most common differences (these can vary slightly by keyboard model):

| Symbol you want to type | The key on a Japanese layout | Gotcha under a US layout setting |
|---|---|---|
| `=` (equals) | A dedicated key to the right of `-` | Under a US layout, this is often mapped to `Shift + -` (shift of the hyphen key), and a different symbol may appear at the position of the dedicated `=` key |
| `"` (double quote) | Shift of the `2` key | Under a US layout, this is mapped to the shift of the `'` (single quote) key |
| `@` (at sign) | Shift of the `2` key (sometimes the same key as `"` on a Japanese layout) | The dedicated key position differs on a US-layout keyboard |
| `_` (underscore) | Near the `ろ` key, or shift of `-` | Under a US layout, this is consistently the shift of the `-` key |

**The most reliable fix, if your physical keyboard is Japanese, is to match the OS's keyboard layout setting to "Japanese."** If you accidentally picked "English (US)" during install, you can change it afterward with:

```bash
sudo dpkg-reconfigure keyboard-configuration
```

This brings up an interactive configuration screen — pick a generic "Keyboard model," and set "Country of origin" to "Japan" to make a Japanese-layout keyboard type exactly what's printed on its keys. After changing the setting, log out and back in (or run `sudo systemctl restart console-setup`) to apply it.

<details>
<summary>Why is a US layout the default guidance so often, anyway?</summary>

Many Linux distributions' installers and technical documentation are written assuming an "English (US)" layout by default, and for an infrastructure engineer who frequently searches and references English-language technical resources, getting comfortable with a US layout has real practical upside. That said, if you're burning energy on symbol-input mistakes while you're still learning, there's nothing wrong with **matching your physical keyboard with a Japanese layout first, and trying a US layout once you're more comfortable.**

</details>

## Summary

- Creating a VM in Proxmox VE is just a matter of reviewing the General→OS→System→Disks→CPU→Memory→Network tabs and clicking "Confirm."
- Download an OS's installer image (ISO) from its distributing site, and upload it via Proxmox's "ISO Images."
- `sudo apt update` isn't "installing" anything — it's "refreshing the available package information" — and the rule of thumb is to run it before installing anything.
- `sudo su -` switches you to a root shell, but in practice, prefixing individual commands with `sudo` is the recommended approach, for the sake of auditability.
- Matching your keyboard layout setting (Japanese or US) to your actual physical keyboard avoids confusion when typing symbols.

## References

- [Proxmox VE Administration Guide](https://pve.proxmox.com/pve-docs/)
- [Ubuntu Server download](https://ubuntu.com/download/server)
- [GNU nano — Documentation](https://www.nano-editor.org/dist/latest/nano.html)
- [sudo(8) — Linux manual page](https://man7.org/linux/man-pages/man8/sudo.8.html)
