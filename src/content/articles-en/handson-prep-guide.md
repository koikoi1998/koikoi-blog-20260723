---
title: "Hands-On Prep Manual: From Creating a VM in Proxmox VE to Installing an OS"
description: "An entry point organizing the prep this blog's hands-on articles have in common into separate, focused articles. This article covers creating a VM in Proxmox VE and installing an OS; the basics after your first login, Teraterm, Wireshark, and Windows Server's initial setup each get their own dedicated article."
series: "handson-prep"
order: 1
tags: ["proxmox", "linux", "handson", "beginner", "infrastructure"]
emoji: "🧰"
pubDate: 2026-08-09
updatedDate: 2026-08-10
---

## Introduction

- **What You'll Learn From This Article**: The steps common to every hands-on article on this blog (like building your own L2TP/IPsec server), from creating a VM in Proxmox VE through installing an OS.
- **Intended Audience**: Anyone completely new to virtualization platforms (like Proxmox VE) or operating a Linux server, who's about to start working through this blog's hands-on articles.
- **Estimated Reading Time**: About 10 minutes (a bit longer if you follow along hands-on)

This article is part of the [Top 1% Series' full article guide](/en/sitemap). **This article is a dedicated operations manual for "warming up before your first hands-on lab" — it doesn't cover internal mechanics the way other articles in this series do.** If you're curious about Proxmox VE's internals (how KVM/QEMU work), see [What Is Proxmox VE?](/en/articles/proxmox-internals-guide). Every hands-on article on this blog (e.g., the [L2TP/IPsec hands-on lab](/en/articles/l2tp-ipsec-lab-guide)) assumes you can already do what this article group covers.

## How to Use This Article Group

"Hands-On Prep" is split by theme into the following five articles. Skip anything you already know or have used before.

1. **Creating a VM in Proxmox VE and installing an OS** (this article): The VM creation wizard, downloading/uploading an ISO, and installing Ubuntu Server
2. [Setting Up an Ubuntu Server for the First Time](/en/articles/ubuntu-server-setup-guide): Basic operations after your first login — `sudo apt update`, `sudo su -`, `nano` — the US-keyboard-layout gotcha, and checking/enabling the SSH server
3. [Setting Up Windows Server for the First Time](/en/articles/windows-server-setup-guide): Initial setup via Windows Server's GUI, and enabling the SSH server
4. [How to Use Teraterm (a Terminal Client)](/en/articles/teraterm-guide): Creating and saving an SSH connection, character encoding, saving logs
5. [How to Use Wireshark](/en/articles/wireshark-guide): Opening capture files, basic filters, and transferring files with `scp`

This article covers **item 1: creating a VM in Proxmox VE and installing an OS.**

## Step 1: Create a VM in Proxmox VE

Log into the Proxmox VE management UI (browse to `https://<Proxmox's IP address>:8006`), select your node, and open the creation wizard from the **"Create VM"** button in the top right.

| Tab | Main settings | Rule of thumb for a hands-on lab |
|---|---|---|
| General | VM ID, name | Give it a name that reflects the lab (e.g., `l2tp-server`) so you can tell it apart later |
| OS | The ISO image to install from | Select the ISO you uploaded in Step 2 |
| System | BIOS type, whether to use the QEMU guest agent, etc. | The defaults are usually fine |
| Disks | Disk size, storage location | 8–20GB is often plenty for a lab (follow whatever a specific article requires) |
| CPU | Core count | 1–2 cores is often plenty for a lab |
| Memory | Memory (MB) | 1–2GB is often plenty for a lab |
| Network | Which bridge to attach (usually `vmbr0`) | Choose `vmbr0` if you want the VM directly on your home LAN |

Once you've reviewed every tab, click "Confirm" to create the VM. It won't be running yet at this point.

## Step 2: Download and upload the OS installation media (ISO)

**Download the ISO**: Download the installation ISO from the distributing OS's official site. For Ubuntu Server, for example, picking the LTS (long-term support) release from the [official Ubuntu download page](https://ubuntu.com/download/server) is a safe default.

**Upload it to Proxmox**: In the Proxmox UI, pick the storage where you want to keep ISOs (usually `local`), then use "ISO Images" → "Upload" to upload the file you downloaded. If your setup supports "Download from URL" (fetching the ISO directly by URL), that can be faster since it doesn't route through your own connection.

## Step 3: Install the OS from the ISO (using Ubuntu Server as an example)

Select the VM you created in Step 1, click "Start," then open the "Console" tab to operate the VM's screen right in your browser (this uses a technology called noVNC — think of it like remote desktop for the VM's display).

Once the Ubuntu Server installer boots, you'll generally go through this flow.

1. **Language selection**: Leaving it as "English" is common (there's less information out there for a Japanese UI, and English error messages are easier to search for).
2. **Keyboard layout selection**: The layout you choose here affects both the rest of the install and how input works afterward. If your physical keyboard has a Japanese layout, choosing "Japanese" means what's printed on the keys matches what actually gets typed. The gotcha with choosing "English (US)" instead is covered in [Setting Up an Ubuntu Server for the First Time](/en/articles/ubuntu-server-setup-guide).
3. **Network configuration**: If `vmbr0` is bridged directly to your LAN, an IP address is usually assigned automatically via DHCP, and you can just continue.
4. **Storage configuration**: Following the default guidance (something like "Use an entire disk") is fine unless you have a specific reason not to.
5. **Profile setup**: Set the server name, username, and password. The user you create here becomes the admin user who can use `sudo` after installation.
6. **Installing OpenSSH server**: Strongly recommended — check "Install OpenSSH server." This lets you connect to the VM over SSH once installation finishes (easier to copy-paste with than the Console screen), and every hands-on article on this blog assumes an SSH connection from here on. If you forget to check this, see [Setting Up an Ubuntu Server for the First Time](/en/articles/ubuntu-server-setup-guide) for how to fix it after the fact.
7. **Featured server snaps**: Unless a specific lab tells you otherwise, it's fine to select nothing here (you'll install anything you need individually via `apt` later).

Installation finishes with a prompt to reboot. **Before rebooting, don't forget to eject the ISO image from the VM's optical drive (or change the boot order).** Forgetting this means the installer boots again every time you reboot (you can unmount the ISO from the VM's "Hardware" tab → CD/DVD drive in Proxmox).

Once it's back up, move on to [Setting Up an Ubuntu Server for the First Time](/en/articles/ubuntu-server-setup-guide) to check the basics after connecting over SSH.

## Summary

- Creating a VM in Proxmox VE just means reviewing each tab — General → OS → System → Disks → CPU → Memory → Network — and clicking "Confirm."
- Download the OS installation media (ISO) from the distributing site, then upload it via Proxmox's "ISO Images."
- After installation finishes, you need to eject the ISO from the optical drive before rebooting.
- Post-first-login basics (`apt update`/`su -`/`nano`/checking the SSH server) are covered in [Setting Up an Ubuntu Server for the First Time](/en/articles/ubuntu-server-setup-guide), and using an SSH client is covered in [How to Use Teraterm](/en/articles/teraterm-guide).

## References

- [Proxmox VE Administration Guide](https://pve.proxmox.com/pve-docs/)
- [Ubuntu Server download](https://ubuntu.com/download/server)
