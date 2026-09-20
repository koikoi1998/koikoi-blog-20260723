---
title: "Why Do Files With Identical-Looking Names Have Different Character Counts in Windows? Understanding Unicode Normalization and BOX Migration Trouble From a \"Top 1%\" Perspective"
description: "Two files that look like they have exactly the same name in File Explorer can return different character counts when checked in PowerShell. Why can these two coexist as separate files in Windows, yet get judged as having the same name — causing a migration to fail — in a cloud storage service like BOX? This article systematically explains it from the perspective of Unicode normalization (NFC/NFD)."
series: "windows-client"
order: 3
tags: ["windows", "unicode", "powershell", "infra", "troubleshooting"]
emoji: "🔤"
pubDate: 2026-09-20
---

## Introduction

- **What You'll Learn From This Article**: Starting from a puzzling phenomenon — two files that look completely identical by name in File Explorer return different character counts when checked with PowerShell's `Get-ChildItem` — this article systematically explains what's really going on, from the perspective of **Unicode normalization (NFC/NFD)**. It also covers why these can coexist as separate files in Windows, yet get judged as "files with the same name" and collide/fail when migrated to a cloud storage service like BOX.
- **Intended Audience**: This article is aimed at engineers who've been involved in migrating from a file server to cloud storage, but who can't explain the cause of a filename that looks identical yet has a different character count.
- **Estimated Reading Time**: About 16 minutes

This article is part of the [Top 1% Series' full article guide](/en/sitemap), and the third article in the [Windows Client Operations Series](/en/sitemap#series-list).

## Prerequisites

- **Unicode**: A character encoding standard that maps every character worldwide to a unique number (a code point).
- **Code point**: A number assigned in Unicode to a single character (or a component that makes up a character).

## Getting the Big Picture

### In a Nutshell

**Japanese characters with a dakuten/handakuten mark (such as が or ぱ), and Latin characters with an accent mark (such as é), can be represented in Unicode in two different ways: "as a single code point" or "as a combination of multiple code points."** These two are perfectly identical on-screen (as a glyph), but their internal sequence of code points — which is what gets counted as the character count — differs.

```mermaid
graph LR
    subgraph Nfc["Precomposed form (NFC)"]
        NfcChar["\"が\"<br/>= a single code point, U+304C<br/>(character count: 1)"]
    end
    subgraph Nfd["Decomposed form (NFD)"]
        NfdChar["\"か\" (U+304B) + a combining character for the dakuten (U+3099)<br/>= a combination of two code points<br/>(character count: 2)"]
    end
    Nfc -.identical on-screen appearance.-> Nfd
```

## Fundamentals, Explained Thoroughly

### Why the Displayed Character Count Differs

Running a command like the following in PowerShell to compare the character count of filenames that look identical can actually return different numbers:

```powershell
Get-ChildItem | Select-Object Name, @{Name="Length"; Expression={$_.Name.Length}}
```

What this command's `.Length` returns is **the number of code points making up that string** (more precisely, the number of UTF-16 code units, .NET's internal string representation). As noted above, if a character with a dakuten is saved in its **precomposed form (NFC, Normalization Form C)**, it counts as one character; if saved in its **decomposed form (NFD, Normalization Form D)**, the base character and its combining character together count as two (or more) characters. **Since the on-screen display (the glyph) looks exactly the same "が" either way**, this difference is impossible to notice just by looking at it.

<details>
<summary>What is a combining character?</summary>

A **combining character** is a special code point that isn't displayed on its own — it adds a decoration, such as "attach a dakuten" or "attach an accent mark," to the character immediately before it. Beyond Japanese dakuten/handakuten marks, many languages' accented characters — French accent marks, German umlauts, and so on — can be represented in this decomposed form using combining characters.

</details>

### Why These Can Coexist as Separate Files in Windows

What matters here in practice is that **Windows's file system (NTFS) doesn't perform Unicode normalization when comparing filenames.** NTFS does compare filenames case-insensitively, but it **doesn't perform the normalization that would treat the differing code-point sequences of a precomposed and a decomposed form as "the same name."** So even though a filename like "が.txt" looks completely identical, if one copy is encoded in precomposed form and the other in decomposed form, **the OS recognizes them as two different filenames, and they can coexist as separate files within the same folder.**

### Why BOX Judges Them as Files With the Same Name

Many cloud storage services (BOX and others), on the other hand, typically **perform Unicode normalization before comparing** filenames during upload and sync processing (usually normalizing to NFC form before comparing). Once normalization is applied, a filename encoded in either precomposed or decomposed form gets **converted to the same normalization form (say, NFC) before being compared**, so two filenames that look identical **are judged, at that point, as exactly the same string.**

**This difference in normalization policy between the two systems is the true cause of the migration trouble.** Files that coexisted fine in Windows as separate files, since it performs no normalization, get normalized during the upload to BOX, and a collision occurs — "a file with this name already exists" — causing the migration to fail.

```mermaid
sequenceDiagram
    participant Ntfs as Windows (NTFS)
    participant Box as BOX

    Note over Ntfs: "が.txt" (NFC form) and<br/>"が.txt" (NFD form)<br/>coexist as separate files
    Ntfs->>Box: Both files are uploaded
    Note over Box: At upload time, filenames are normalized to NFC and compared
    Box-xNtfs: Judged as "a file with this name already exists" — one collides and fails
```

### Where Does a Decomposed-Form Filename Actually Come From?

In practice, this decomposed-form filename issue is often encountered with **files created or copied from macOS.** The file system macOS traditionally uses (HFS+ and others) had a historical specification of normalizing and saving filenames in decomposed form (NFD), and traces of this remain in some workflows even today. Filenames generated by certain scanner devices, OCR software, or some legacy systems can also end up unintentionally encoded in decomposed form. **Organizations that frequently copy or share files between Mac and Windows environments carry a particularly high risk of running into this problem** — a practical tendency worth keeping in mind, as it's a useful clue when investigating the cause.

## The View From the Top 1% Perspective

### Unifying the Normalization Form with PowerShell

Detecting decomposed-form filenames before a migration and unifying them into precomposed form (NFC) can head off this kind of collision before it happens. PowerShell's `.Normalize()` method lets you convert a string to a specified normalization form.

```powershell
# Example: normalize the current filename to NFC form and rename it
Get-ChildItem -Recurse | ForEach-Object {
    $normalizedName = $_.Name.Normalize([System.Text.NormalizationForm]::FormC)
    if ($_.Name -ne $normalizedName) {
        Rename-Item -Path $_.FullName -NewName $normalizedName
    }
}
```

**Before a large-scale migration, scanning the entire target folder with a script like this to detect and fix filenames with an inconsistent normalization form ahead of time** significantly reduces the risk of a failed migration. This can't be caught by eye, so mechanical detection via a script is essential in practice.

### Normalization Policy Varies by Tool and Service

**"Surely the OS or application normalizes this automatically" is an expectation you shouldn't rely on.** Whether normalization is performed at all, and if so, which normalization form is used (NFC/NFD/NFKC/NFKD, and so on), varies by policy across the OS, file system, cloud service, and application. When handling files across multiple systems in practice, **checking ahead of time what normalization policy each system adopts** is important for avoiding this kind of trouble.

## Common Misconceptions and Pitfalls

- **Misconception 1: "If two filenames look identical, they're completely identical internally too"**
  Since a precomposed form and a decomposed form are two different representations with different internal code-point sequences, the underlying data can differ even when the appearance is identical.
- **Misconception 2: "Windows automatically normalizes and unifies filenames that are represented differently"**
  NTFS does compare filenames case-insensitively, but it doesn't perform Unicode normalization (unifying precomposed and decomposed forms).
- **Misconception 3: "This problem only happens in Japanese-language environments"**
  This isn't limited to dakuten/handakuten marks — it's a general Unicode normalization issue that can also occur with accented Latin characters, such as in French or German.

## The Troubleshooting Perspective

For the phenomenon of identical-looking filenames being treated as separate, the basic approach is to **compare the character (code point) count to mechanically detect the difference in normalization form.**

1. **An error like "a file with this name already exists" occurs when migrating to BOX or similar**: In the source folder, use `Get-ChildItem`'s `.Length` property to check whether identical-looking filenames actually differ in character count.
2. **A difference in character count is found**: Unify the normalization form with the `.Normalize()` method, rename the files, and retry the upload/sync.
3. **You want to identify where the problematic files originated from**: Check that file's creation/modification history, and whether there's a path by which files were copied from a Mac environment within the organization.

### Preventive Measures and Permanent Fixes

- When planning a large-scale migration to cloud storage, build a script that unifies filename normalization forms ahead of time into the checklist.
- If files are regularly shared between Mac and Windows environments, consider a mechanism to periodically scan for normalization-form inconsistencies.
- When handling files across multiple systems, check each system's normalization policy (whether it normalizes, and to which form) ahead of time.

## Summary

- A character with a dakuten or accent mark can be represented in two ways — precomposed form (NFC) and decomposed form (NFD) — that look identical but differ in code point count.
- Windows (NTFS) doesn't perform Unicode normalization when comparing filenames, so filenames in these two forms can coexist as separate files.
- Cloud storage services like BOX normalize filenames before comparing them during upload/sync, so files that coexisted in Windows get judged as having "the same name," colliding and failing during migration.
- Decomposed-form filenames tend to arise mainly from files that originated on macOS, and can be detected and unified before a migration using PowerShell's `.Normalize()` method.

**What to Keep in Mind From Today**
1. If you run into an unexplained "duplicate filename" error during a cloud storage migration, check for a character-count difference using `Get-ChildItem`'s `.Length` property.
2. If you regularly share files with a Mac environment, keep in mind that normalization-form inconsistencies are more likely to occur.

## References

- [Unicode Normalization Forms | Unicode Standard Annex #15](https://unicode.org/reports/tr15/)
- [String.Normalize Method | Microsoft Learn](https://learn.microsoft.com/en-us/dotnet/api/system.string.normalize)
- [Naming Files, Paths, and Namespaces | Microsoft Learn](https://learn.microsoft.com/en-us/windows/win32/fileio/naming-a-file)
