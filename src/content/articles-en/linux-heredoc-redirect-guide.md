---
title: "Understanding How cat > file << 'EOF' Works From a \"Top 1%\" Perspective: Shell Redirection and Here Documents"
description: "Understand what a construct like cat > file << 'EOF', which shows up constantly in hands-on articles, actually does. Covers the basics of standard I/O redirection (>, >>, <), how a here document (<<) passes multiple lines of text at once, and the difference between wrapping EOF in single vs. double quotes."
series: "linux"
subSeries: "main"
order: 14
tags: ["linux", "shell", "bash"]
emoji: "📜"
pubDate: 2026-09-26
---

## Introduction

- **What You'll Learn From This Article**: Hands-on articles on this blog have used a construct like `cat > db_secrets.yml << 'EOF'` several times without explanation. This article breaks down the two elements that make up this construct — **redirection** (`>`, `>>`, `<`) and a **here document** (`<<`) — and understands each one separately.
- **Intended Audience**: Readers who've copy-pasted a `cat > file << 'EOF'` construct while following a hands-on's steps, but can't explain what `>` or `<<` are actually doing.
- **Estimated Reading Time**: About 15 minutes

This article is part of the [Top 1% Series Complete Article Guide](/en/sitemap), the 14th article in the [Linux/OS Fundamentals Series](/en/sitemap#series-list).

## The Big Picture

```mermaid
graph LR
    Command["A command's result<br/>(standard output)"]
    Redirect[">redirects it"]
    File["Written to a file"]
    Heredoc["<<is a here document<br/>(passes multiple lines of input at once)"]

    Command --> Redirect --> File
    Heredoc --> Command
```

## A Thorough, Grounds-Up Explanation

### Redirection: Switching Where Output Goes and Input Comes From

A Linux command outputs its result, by default, through a path called "standard output," which displays text on the screen. **Redirection** is the mechanism that switches this output destination (or input source) from the screen to somewhere else, like a file.

| Symbol | Meaning |
|---|---|
| `>` | Write standard output to a file (overwriting its content if the file already exists) |
| `>>` | Append standard output to a file (existing content stays intact, with new content added at the end) |
| `<` | Feed a file's content as a command's standard input |

```bash
echo "Hello" > greeting.txt
cat greeting.txt
```

**The `echo` command's result would normally display on screen, but `>` writes it to a file called `greeting.txt` instead of the screen.** Change `>` to `>>`, and it appends every time you run it, instead of overwriting like `>` does.

### Here Documents: Passing Multiple Lines of Text at Once

`<` feeds an existing single file's content, but a **here document** (`<<`) is a mechanism that feeds the multiple lines of text you're about to type right there, directly to the command, on the spot.

```bash
cat > db_secrets.yml << 'EOF'
db_user: admin
db_password: SecretP@ss123
EOF
```

This syntax breaks down as follows.

1. `cat > db_secrets.yml`: Write `cat`'s output to a file called `db_secrets.yml` (redirection)
2. `<< 'EOF'`: A declaration meaning "treat everything from here until a line containing just the string `EOF` appears, as input to `cat`"
3. Lines 2 and 3: The actual input content for `cat` (not commands — just plain text data)
4. The final `EOF`: The terminating marker, indicating the end of the input

`cat` is normally a command for displaying a file's content, but here, since neither an input source nor an output destination is specified, it just takes whatever it receives from standard input and passes it straight through to standard output. **That standard input has been swapped out, via the here document, for "the multiple lines of text about to follow," and that standard output has been swapped out, via redirection, for the file `db_secrets.yml`** — this two-stage mechanism is happening simultaneously, all within this one line.

<details>
<summary>Does the terminating marker have to be "EOF"?</summary>

No, the string `EOF` itself carries no special meaning. It's used by convention as an abbreviation for "End Of File," but you can use any string, like `END` or `STOP`. That said, if a line matching that same string happens to appear inside the body text, it gets mistakenly recognized as the terminator right there — so a real-world consideration is choosing a sufficiently unique string that's unlikely to appear in the body.

</details>

### The Difference Between Wrapping It in Single vs. Double Quotes

Whether you wrap `EOF` in single quotes, like `<< 'EOF'`, changes the behavior.

```bash
name="World"
cat << EOF
Hello, $name
EOF
```

```bash
cat << 'EOF'
Hello, $name
EOF
```

**Without quoting `EOF`, a variable like `$name` inside the here document's content gets expanded by the shell into its actual value.** The first example's output is `Hello, World`. Wrap it in single quotes, on the other hand, and **variable expansion doesn't happen at all — the string `$name` is output exactly as-is.** The second example's output stays `Hello, $name`. When you want to write a literal `$` character straight into a file — a config file template, say — wrapping it in single quotes is essential.

## What a Pro Sees Here (Top 1% Understanding)

### Why Hands-On Articles Use a Here Document Instead of nano

This blog's hands-on articles feature both interactively editing a file with `nano` and creating a file in one shot with a here document. There's a reason for this split. **Since a here document embeds the file's content as a literal string inside the command itself, just running that one command reproduces the exact same file content, identically, for anyone.** An interactive editor like `nano`, on the other hand, assumes a human is watching the screen and typing — a written guide can say "type it in like this," but it can't automate the act of running it. When you want to automate environment setup purely with shell scripts, without a tool like Ansible, a here document is the standard tool for the job.

## Common Misconceptions and Pitfalls

- **Misconception 1: "`>` and `>>` mean the same thing — use whichever is easier to type."**
  `>` overwrites existing content, while `>>` appends to the end. Use `>` when you meant to append to a log file, and you risk the accident of wiping out everything that was there before.
- **Misconception 2: "A here document's terminating marker must always be written as `EOF`."**
  `EOF` is purely a convention — you can use any string. What matters is choosing a unique one that doesn't appear in the body text.
- **Misconception 3: "Variables always get expanded inside a here document."**
  Wrap the terminating marker in single quotes, and variable expansion doesn't happen at all.

## Troubleshooting Perspective

1. **Running a here document never returns you to the command prompt**: Check whether the terminating marker's line (like `EOF`) genuinely exists as a standalone line. A stray space before or after it can prevent it from being recognized as the terminator.
2. **The file ends up with the literal text `$name` instead of the expanded value**: Check whether the terminating marker is wrapped in single quotes. To get variable expansion, use an unquoted `<< EOF`.
3. **You meant to overwrite with `>`, but content is unintentionally being appended**: Check whether you're using `>>` instead of `>`.

## Summary

- `>` overwrites and `>>` appends — that's the basic difference in redirection.
- A here document (`<<`) is a mechanism for feeding multiple lines of text directly as a command's standard input, on the spot.
- The terminating marker (like `EOF`) is purely a conventional string — you can choose any string you like.
- Wrapping the terminating marker in single quotes disables variable expansion, which is what you want when writing a literal `$`.

**Takeaways to Apply Today**
1. Before using `>`, pause for a beat to check whether it's genuinely okay to overwrite, or whether the operation should append with `>>` instead.
2. When writing content containing `$` inside a here document, deliberately choose whether to quote it based on whether you want variable expansion.

## References

- [Bash Reference Manual: Redirections](https://www.gnu.org/software/bash/manual/bash.html#Redirections)
- [Bash Reference Manual: Here Documents](https://www.gnu.org/software/bash/manual/bash.html#Here-Documents)
