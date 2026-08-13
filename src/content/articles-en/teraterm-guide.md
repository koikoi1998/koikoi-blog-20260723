---
title: "Hands-On Prep Manual: How to Use Teraterm (a Terminal Client) — From Creating an SSH Connection to Fixing Garbled Text and Saving Logs"
description: "A prep manual for the basics of Teraterm, a terminal client widely used to remotely connect from Windows to Linux/Windows Server hosts. Covers creating a new SSH connection, confirming the host key on first connect, fixing garbled text via character-encoding settings, saving connection settings, and recording session logs."
series: "handson-prep"
order: 4
tags: ["teraterm", "ssh", "handson", "beginner", "infrastructure"]
emoji: "💻"
pubDate: 2026-08-10
---

## Introduction

- **What You'll Learn From This Article**: The basics of Teraterm, a terminal client for SSH-connecting from a Windows PC to a Linux server or Windows Server you've built on Proxmox VE. Covers creating a new connection, fixing garbled text, saving connection settings, and recording logs.
- **Intended Audience**: Anyone completely new to SSH-connecting via a terminal client who's about to work through this blog's hands-on articles.
- **Estimated Reading Time**: About 10 minutes

This article is part of the [Top 1% Series' full article guide](/en/sitemap), one of the theme-specific articles split off from the [hands-on prep manual](/en/articles/handson-prep-guide). For preparing the Linux/Windows Server host you're connecting to, see [Setting Up an Ubuntu Server for the First Time](/en/articles/ubuntu-server-setup-guide) or [Setting Up Windows Server for the First Time](/en/articles/windows-server-setup-guide).

## What Is Teraterm?

**Teraterm** is an open-source terminal emulator (terminal client) that runs on Windows. It supports SSH, Telnet, and serial connections, and is especially popular for infrastructure/networking work in Japan. If you're on macOS or Linux, the standard `ssh` command or another terminal client (like iTerm) works just as well — the underlying concepts are basically the same.

## Step 1: Install It

Download the latest installer from the [Tera Term Project (OSDN)](https://ttssh2.osdn.jp/index.html.en) distribution page and install it like any normal Windows application. There's no need to pick any special options — clicking "Next" through the defaults is fine.

## Step 2: Create a New SSH Connection

When Teraterm starts, the "Tera Term: New connection" dialog opens automatically (if it doesn't, open it from the menu via "File" → "New connection...").

1. Choose "**SSH**" as the connection type.
2. Enter the target server's IP address or hostname in the "Host" field.
3. Leave "TCP port#" at SSH's standard port, `22` (match whatever value the server is configured to use if it's non-standard).
4. Choose "SSH2" for "SSH version" (SSH1 is old and has known vulnerabilities — don't use it).
5. Click "OK" to start connecting.

On your first connection, a "SECURITY WARNING" dialog appears. This is because you haven't yet recorded the target server's **host key (public key)** as trusted. Once you've confirmed the displayed fingerprint matches the value you checked on the server, click "Continue." After you trust it once, this confirmation won't appear again on subsequent connections (it reappears if the server is rebuilt and its host key changes).

Next, you'll be prompted for authentication. Most hands-on labs use password authentication, so choose "**Plain password**" under "Authentication," enter your username and password, and click "OK" to complete the connection.

## Step 3: Fix Garbled Text (Character Encoding Settings)

If output from a Linux server (especially logs or comments containing Japanese text) doesn't display correctly, a character-encoding mismatch is almost always the cause.

1. Open "**Setup**" → "**Terminal...**" from the menu.
2. Set both "Receive" and "Transmit" to "**UTF-8**" (most Linux distributions default to UTF-8).
3. Match "Kanji (transmit)," below "Kanji (receive)," to UTF-8 as well.
4. Click "OK" to apply.

## Step 4: Set a Readable Font

From "Setup" → "Font...", you can adjust the monospace font (like MS Gothic or Consolas) and size to your liking. Since you'll often want to compare a config file's columns lined up vertically, using a **monospace font** is recommended.

## Step 5: Save Your Connection Settings (So You Don't Retype Them Every Time)

Re-entering the IP address and port every time you connect is inefficient. From "Setup" → "**Save setup...**", you can save your current connection, character-encoding, and font settings as a `.ini` file. If you point a Teraterm shortcut's properties at the saved file as an argument, double-clicking it launches Teraterm with those settings already applied.

<details>
<summary>If you're switching between several servers</summary>

Some hands-on labs have you connect to multiple VMs (a server and a client, say). Saving a separate connection profile for each server as its own `.ini` file (e.g., `l2tp-server.ini`, `l2tp-client.ini`) helps avoid the mistake of connecting to the wrong host.

</details>

## Step 6: Record a Session Log

It's handy to save a log of your session so you can look back later at exactly what you ran and what happened, especially when troubleshooting.

1. Select "**File**" → "**Log...**" from the menu.
2. Specify a filename and click "Save" — from then on, everything shown on screen gets recorded to that text file.
3. To stop logging, use "Pause" or "Close" under "File" → "Log."

This log also comes in handy when you want to revisit an investigation you did following an article like [Investigating Error Logs with journalctl](/en/articles/linux-journalctl-guide), or paste it in when asking someone else for help.

## Checkpoints When You Can't Connect

| Symptom | What to check |
|---|---|
| The connection times out | Is the server's IP address correct? Is the server itself running? Is the network path (e.g., Proxmox's bridge settings) correct? |
| "Connection refused" appears | Is the SSH server running on the target (see [Setting Up an Ubuntu Server for the First Time](/en/articles/ubuntu-server-setup-guide) / [Setting Up Windows Server for the First Time](/en/articles/windows-server-setup-guide))? Is port 22 allowed through the firewall? |
| Authentication fails | A typo in the username/password, or a case mismatch (especially symbol-input mistakes if you're using a US keyboard layout) |

## Summary

- Teraterm creates an SSH connection via "File" → "New connection...", and your first connection shows a host-key confirmation (SECURITY WARNING).
- Garbled Japanese text is usually fixed by matching the Receive/Transmit character encoding to UTF-8 under "Setup" → "Terminal...".
- Saving your connection settings as a `.ini` file via "Setup" → "Save setup..." makes future connections smoother.
- Recording a session log via "File" → "Log..." helps when you need to look back at a troubleshooting session.

## References

- [Tera Term Project (OSDN)](https://ttssh2.osdn.jp/index.html.en)
- [Tera Term GitHub repository](https://github.com/TeraTermProject/teraterm)
