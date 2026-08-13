---
title: "Hands-On Prep Manual: Setting Up Windows Server 2025 for the First Time and Enabling SSH (GUI Only)"
description: "A prep manual for a Windows Server 2025 VM built on Proxmox VE: initial setup using nothing but the GUI, then enabling the OpenSSH server so you can connect with an SSH client like Teraterm. Everything is done through Server Manager's screens rather than PowerShell commands."
series: "handson-prep"
order: 3
tags: ["windows-server", "handson", "beginner", "ssh", "infrastructure"]
emoji: "🪟"
pubDate: 2026-08-10
---

## Introduction

- **What You'll Learn From This Article**: For a Windows Server 2025 VM built on Proxmox VE, how to do initial setup (computer name, network, time zone) using nothing but the GUI, then enable the OpenSSH server so you can connect with an SSH client like Teraterm.
- **Intended Audience**: Anyone completely new to Windows Server who's about to work through this blog's hands-on articles (for example, verification steps tied to [Building L2TP/IPsec VPN on Windows Server (RRAS)](/en/articles/windows-server-l2tp-vpn-guide)).
- **Estimated Reading Time**: About 15 minutes

This article is part of the [Top 1% Series' full article guide](/en/sitemap), one of the theme-specific articles split off from the [hands-on prep manual](/en/articles/handson-prep-guide). **This article sticks entirely to GUI operations (the settings screens, Server Manager) — no PowerShell commands.** For creating the VM itself, see [Creating a VM in Proxmox VE and Installing an OS](/en/articles/handson-prep-guide) (aside from where you get the ISO, the creation steps are the same as for a Linux VM).

## Step 1: Initial Setup After Your First Login

After installation finishes, your first login prompts you to set the Administrator password. **Server Manager** opens automatically by default after that (if you close it, you can reopen it from the Start menu).

In Server Manager's dashboard, select "Local Server" in the top left, and check/update the following from the settings listed on the right.

| Setting | What to do |
|---|---|
| Computer name | Clicking the value opens the "System Properties" dialog, where the "Change" button lets you rename it. A reboot is required afterward. |
| Ethernet (IP address) | Clicking the value (usually shown as something like "IPv4 address assigned by DHCP, IPv6 enabled") opens the network adapter's settings. For a static IP, right-click the adapter → "Properties" → "Internet Protocol Version 4 (TCP/IPv4)" → "Properties," and enter the IP address, subnet mask, and default gateway. |
| Time zone | Clicking the value opens the date/time settings screen. Set it to match your region (e.g., "Tokyo"). |
| Windows Update | Recommended to keep this current (run it from "Download and install updates"). |

## Step 2: Enable the OpenSSH Server (GUI Only)

Windows Server 2019 and later ship with **OpenSSH Server** as a built-in feature. Enable it entirely through the GUI from Server Manager's dashboard, as follows.

1. From the "Manage" menu in the top right of Server Manager's dashboard, select "**Add Roles and Features**."
2. Once the wizard starts, keep "Role-based or feature-based installation" selected on the "Installation Type" screen and click "Next" through the following screens, confirming the target server (usually the local server is already selected).
3. On the "Server Roles" screen, select nothing and just click "Next."
4. On the "**Features**" screen, find "**OpenSSH Server**" in the list and check it (you'll also see "OpenSSH Client" nearby — that's for connecting *from* this VM *to* other servers over SSH, which you don't need for this).
5. Click "Next" → "Install" to start installing the feature. Once it finishes, click "Close" to dismiss the wizard.

<details>
<summary>If OpenSSH Server doesn't show up in the list</summary>

Depending on your Windows Server edition and language pack state, this feature may not have been fetched from Windows Update yet. If so, run Windows Update once (see Step 1), reboot, and try opening "Add Roles and Features" again.

</details>

## Step 3: Start the SSH Service and Enable Auto-Start

Installing the feature alone doesn't start the service. Check and configure its running state from the GUI Services screen.

1. Type "**Services**" into the Start menu's search box and open the "Services" app (`services.msc`).
2. Find "**OpenSSH SSH Server**" in the list and double-click it to open its properties.
3. Change "Startup type" to "**Automatic**" (it's usually "Manual" by default, which means you'd have to manually start the service again after every OS reboot).
4. Click the "**Start**" button in the "Service status" field to start the service right now.
5. Click "OK" to save.

## Step 4: Confirm the Firewall Allow Rule

Installing the OpenSSH Server feature usually automatically creates an inbound rule named "OpenSSH SSH Server (sshd)" that allows TCP port 22. It's worth double-checking this from the GUI, just to be safe.

1. Type "**Windows Defender Firewall with Advanced Security**" into the Start menu's search box and open it.
2. Select "Inbound Rules" from the tree on the left.
3. Confirm that a rule named "**OpenSSH SSH Server (sshd)**" appears in the list and is enabled (a green checkmark). If it's disabled, right-click it and select "Enable Rule."

Once you've completed this, you can connect from your own PC using an SSH client like [Teraterm](/en/articles/teraterm-guide), e.g. `ssh Administrator@<this VM's IP address>` (on your first connection, you'll be asked whether to trust the server's key fingerprint).

<details>
<summary>Tip: Enabling Remote Desktop (RDP) is also handy</summary>

Since SSH is primarily for command-line work, configuration tasks that need a GUI (such as the RRAS configuration wizard covered elsewhere on this blog) may still call for a Remote Desktop (RDP) connection. In Server Manager's "Local Server" dashboard, click the "Remote Desktop" item and select "Allow remote connections to this computer" to be able to control the full GUI screen from a Remote Desktop client on your own PC.

</details>

## Summary

- Windows Server 2025's initial setup — computer name, IP address, time zone — can be fully configured through the GUI from Server Manager's "Local Server" dashboard.
- OpenSSH Server can be installed entirely through the GUI, from the "Features" screen of the "Add Roles and Features" wizard (no need for the PowerShell `Add-WindowsCapability` command).
- After installing, remember to open the Services app and change "OpenSSH SSH Server"'s Startup type to "Automatic," and make sure to start it.
- It's worth confirming the "OpenSSH SSH Server (sshd)" inbound firewall rule is enabled from the Windows Defender Firewall screen, just to be safe.

## References

- [OpenSSH in Windows Server | Microsoft Learn](https://learn.microsoft.com/en-us/windows-server/administration/openssh/openssh_overview)
- [Windows Server documentation | Microsoft Learn](https://learn.microsoft.com/en-us/windows-server/)
