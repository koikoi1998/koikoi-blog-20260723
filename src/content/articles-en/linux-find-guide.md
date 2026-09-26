---
title: "The Top 1% Hands-On for Tracking Down a File or Directory Yourself With find: Training Your Instinct for Where Things Live"
description: "When you've forgotten the path of a file you meant to edit, track it down yourself with the find command and directory naming conventions instead of looking back at a reference. Covers building search conditions by name, modification time, and type, and choosing between find, tree, and locate."
series: "linux"
subSeries: "handson"
order: 13
tags: ["linux", "shell", "handson"]
emoji: "🧭"
pubDate: 2026-09-26
---

## Introduction

- **What You'll Learn From This Article**: A guided hands-on like [A "Top 1%" Hands-On Lab: Building a DNS Server With BIND and Experiencing a Zone Transfer](/en/articles/dns-server-handson-guide) spells out every file path you'll edit. But in real-world work, tracking down "where was that file again?" on your own, with no guide to fall back on, comes up constantly. This article trains that instinct hands-on, using the `find` command to track down files and directories yourself.
- **Intended Audience**: Readers who've never used the `find` command, or know the name but have never actually built a search condition with it.
- **Estimated Reading Time**: About 20 minutes (about 30 minutes if you work through it hands-on)

This article is part of the [Top 1% Series Complete Article Guide](/en/sitemap), the 13th article in the [Linux/OS Fundamentals Series](/en/sitemap#series-list).

## The Big Picture

This hands-on consists of four steps.

```mermaid
graph LR
    Step1["Step1<br/>Find a file from part<br/>of its name"]
    Step2["Step2<br/>Narrow by<br/>type and location"]
    Step3["Step3<br/>Narrow by<br/>modification time"]
    Step4["Step4<br/>Run an operation on<br/>a file you found"]
    Step1 --> Step2 --> Step3 --> Step4
```

## Hands-On Steps

### Step 1: Find a file from part of its name

Try finding where, across the entire system, a file containing the string "bind" lives.

```bash
sudo find / -name "*bind*" 2>/dev/null
```

**The `-name` option accepts a partial-match pattern using a wildcard (`*`).** `2>/dev/null` is an incantation that hides the flood of `Permission denied` error messages that show up from directories you don't have access to. This result should turn up `/etc/bind/`, a directory that looks exactly like where configuration would live.

### Step 2: Narrow by type and location

Targeting the `/etc/bind/` directory you just found, list only files (excluding directories).

```bash
find /etc/bind -type f
```

**`-type f` narrows it down to files only, and `-type d` to directories only.** Narrowing the search directory from `/` down to `/etc/bind` shrinks the search scope and makes the result easier to read. "Search broadly across everything first, then once you've narrowed it down, search further from there" is the basic real-world approach.

### Step 3: Narrow by modification time

Try finding "which file did I edit just now" based on modification time.

```bash
find /etc/bind -mmin -30
```

**`-mmin -30` is the condition "modified within the last 30 minutes."** Use `-mtime -1` for "within the last day." This condition is extremely powerful when you know you just edited something, but forgot which file it was.

### Step 4: Run an operation on a file you found

Run an operation directly on files found by `find`.

```bash
find /etc/bind -name "*.local" -exec cat {} \;
```

**The `-exec` option lets you run a specified command on each file that's found.** `{}` is a placeholder meaning "the found file's path goes here," and the trailing `\;` is the fixed syntax marking the end of the command run by `-exec`.

## What a Pro Sees Here (Top 1% Understanding)

### The Instinct for What's Likely Where, From a Directory's Name

Even more important than how to use `find` itself is whether you understand the directory naming conventions covered in [Understanding /etc and Linux's Directory Structure (FHS) From a "Top 1%" Perspective](/en/articles/linux-filesystem-hierarchy-guide). Keep the FHS (Filesystem Hierarchy Standard) convention in mind — configuration goes in `/etc`, logs in `/var/log`, variable data in `/var` — and you can make a good guess about "it's probably around here" before you even run `find`. **`find` is a tool for reinforcing this instinct of "making a good guess" — it isn't a substitute for that instinct itself.** Missing either one means wasted time getting to the file you actually need in real-world work.

### locate and tree, Commands That Complement find

`find` scans the filesystem directly every time it runs, so it takes time when the target scope is broad. **The `locate` command searches a pre-built index (database) of filenames, making it far faster than `find`.** But since that index only updates periodically (usually once a day), it can miss a file created just minutes ago. And when you want to survey a directory's structure as a hierarchy, laid out visually, the `tree` command is a better fit. The basic real-world division is: "`locate` for speed when just searching by name," "`tree` for visually seeing a hierarchy," and "`find` when you need fine-grained conditions — modification time, type, and on-the-spot operations via `-exec`."

## Common Misconceptions and Pitfalls

- **Misconception 1: "find is faster than locate, so you should always use find."**
  locate is actually faster. But since locate's index isn't updated instantly, you need find to search for a just-created file.
- **Misconception 2: "The find command itself fails without adding 2>/dev/null."**
  The command itself doesn't fail. `2>/dev/null` is purely a cosmetic measure to prevent a flood of permission-error messages from cluttering the output.
- **Misconception 3: "-exec can only run read-only commands like cat."**
  `-exec` can also run commands that change or delete files, like `rm` or `mv`. But since accidentally including unintended files in the target is dangerous, it's recommended to first check the list of target files without `-exec`, then add `-exec` afterward.

## Troubleshooting Perspective

1. **find's result has too much output to read**: Narrow the search scope (`/etc` instead of `/`), or add a condition like `-type f` to narrow it down.
2. **A flood of `Permission denied` shows up**: Add `2>/dev/null` at the end, or run it with `sudo`.
3. **locate can't find a recently created file**: Run `sudo updatedb` to manually refresh the index, or use `find` for a very recent file.

## Summary

- `find` searches the filesystem directly, combining conditions like `-name`, `-type`, and `-mmin`/`-mtime`.
- `-exec` lets you run a command on the spot against each file it finds.
- `locate` is fast because it searches an index, but it can miss very recent files.
- Understanding FHS naming conventions feeds directly into the "instinct for a good guess" you need before searching with `find`.

**Takeaways to Apply Today**
1. When you forget a file's path, build the habit of tracking it down yourself with `find` before hunting for a reference document.
2. When you see a directory name, build the habit of thinking about "what's likely stored here" against FHS conventions.

## References

- [find(1) - Linux manual page](https://linux.die.net/man/1/find)
- [locate(1) - Linux manual page](https://linux.die.net/man/1/locate)
