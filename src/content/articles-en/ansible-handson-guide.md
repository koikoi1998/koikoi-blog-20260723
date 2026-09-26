---
title: "A \"Top 1%\" Hands-On Lab: Automating Configuration Across Multiple Servers with Ansible"
description: "Using existing Ubuntu Server VMs, this hands-on lab walks through installing Ansible on a control node, setting up SSH key authentication, writing an Inventory and a Playbook, and automating Nginx installation, startup, and configuration across servers — then running the same Playbook twice to see idempotency (changed=0) with your own eyes."
series: "ansible"
order: 2
tags: ["ansible", "automation", "iac", "handson"]
emoji: "🛠️"
pubDate: 2026-09-20
---

## Introduction

- **What You'll Learn From This Article**: This article puts the concepts covered in [Understanding What Ansible Actually Is From a "Top 1%" Perspective](/en/articles/ansible-guide) into practice, hands-on. Using existing Ubuntu Server VMs, you'll go through **installing Ansible on a Control Node**, **setting up SSH key authentication**, and **writing an Inventory and a Playbook**, then automate installing, starting, and configuring Nginx across servers, and finally **run the same Playbook twice to see idempotency (`changed=0`) with your own eyes.**
- **Intended Audience**: This article is aimed at engineers who've read [Understanding What Ansible Actually Is From a "Top 1%" Perspective](/en/articles/ansible-guide) and want to actually get their hands on Ansible.
- **Estimated Reading Time**: About 40 minutes (including actual hands-on time)

This article is part of the [Top 1% Series' full article guide](/en/sitemap), and the second article in the [Ansible Series](/en/sitemap#series-list).

## Prerequisites

- **The agentless model**: The basic architecture covered in [Understanding What Ansible Actually Is From a "Top 1%" Perspective](/en/articles/ansible-guide) — the control node pushing configuration to managed nodes over SSH.
- **Idempotency**: The design principle that running the same Playbook any number of times produces the same end result. You'll confirm this with your own eyes in Step 6 of this article.

## Prerequisites for This Hands-On Lab

- **Two Ubuntu Server VMs**: Following the procedures in [A Hands-On Prep Manual: Creating a VM and Installing an OS on Proxmox VE](/en/articles/handson-prep-guide) and [Getting Started with Ubuntu Server: A Hands-On Prep Manual](/en/articles/ubuntu-server-setup-guide), prepare **two** Ubuntu Server VMs with SSH enabled. Use one as the **control node** (`control` below) and the other as the **managed node** (`node1` below). If you've only built one so far, just repeat the same procedure once more to get a second.
- **The IP address of each VM**: Note down the IP addresses of both `control` and `node1`, checked with the `ip a` command. They're referred to as `<control's IP>` and `<node1's IP>` below.
- **SSH login to each VM**: Using something like [How to Use Teraterm (a Terminal Program)](/en/articles/teraterm-guide), log into `control` over SSH first (all the work below happens on `control`).

## Step 0: Installing Ansible on the Control Node

While logged into `control` over SSH, install Ansible itself.

```bash
sudo apt update
sudo apt install -y ansible
```

Once installed, check the version.

```bash
ansible --version
```

Alongside the version information, this also displays the Python version and the location of the config file. **This tells you that Ansible itself is software implemented in Python, and that `control` needs its own Python runtime as well.**

For what `sudo apt update` actually does under the hood (and why you run it before `install` every time, rather than out of habit), plus when to reach for `sudo su -` instead of prefixing every command with `sudo`, see [Prep Manual: Initial Setup for an Ubuntu Server](/en/articles/ubuntu-server-setup-guide).

## Step 1: Setting Up SSH Key Authentication

Ansible uses an SSH connection by default, but manually typing a password every run isn't efficient and doesn't suit automation, so set up **SSH key authentication.**

```bash
# Generate a key pair for the control user (skip if you already have one)
ssh-keygen -t ed25519
```

You can press Enter through every prompt to accept the defaults (leaving the passphrase empty is fine for this lab, though setting one is recommended in practice). Register the generated public key with `node1`.

```bash
ssh-copy-id <node1's username>@<node1's IP>
```

`ssh-copy-id` automatically appends the public key generated on `control` to `node1`'s `~/.ssh/authorized_keys`. After running it, confirm you can **log in without entering a password**, with the following command.

<details>
<summary>Note: what ssh-keygen and ssh-copy-id are actually doing</summary>

`ssh-keygen` generates a mathematically paired **private and public key** on the spot. By default it creates two files: `~/.ssh/id_ed25519` (the private key) and `~/.ssh/id_ed25519.pub` (the public key). If you want to use a different key pair for each of several servers from one `control` machine, you can create multiple key pairs by specifying a filename, e.g. `ssh-keygen -f ~/.ssh/id_ed25519_node2`.

What `ssh-copy-id` actually does is take the contents of the public key file you specify (or, if you omit any option, whichever public key sits at the default location, such as `~/.ssh/id_rsa.pub` or `~/.ssh/id_ed25519.pub`) and append it as a single line to the destination's `~/.ssh/authorized_keys` file over SSH. **It does not copy "all your public keys at once" — it copies exactly one public key file.** If you're managing multiple key pairs, specify which public key to copy explicitly with the `-i` option, e.g. `ssh-copy-id -i ~/.ssh/id_ed25519_node2.pub <username>@<IP>`.

</details>

```bash
ssh <node1's username>@<node1's IP>
# If you can log in without being asked for a password, you're good. Then exit back to control
exit
```

## Step 2: Writing an Inventory File

Create a working directory, and write an **Inventory** file listing the managed servers.

```bash
mkdir ~/ansible-lab && cd ~/ansible-lab
nano inventory.ini
```

Write the following content (replace the IP address and username with your own environment's).

```ini
[webservers]
node1 ansible_host=<node1's IP> ansible_user=<node1's username>
```

`[webservers]` is a **group name** — a unit for referring to multiple servers together. Here it's just one server, but if you add a second managed VM, you can scale up simply by adding one more line inside the same `[webservers]` group.

**`ansible_host` and `ansible_user` are reserved key names Ansible parses specially — misspell either by even one character (say, typing `ansilbe_user` instead of `ansible_user`), and Ansible silently treats it as an ordinary, ignored custom variable instead.** With no username actually specified, Ansible falls back to connecting as whatever unintended user it defaults to (typically the local user running Ansible, or `root`). If you hit a connection error in the next step, check this file's spelling character by character first.

## Step 3: Checking Connectivity (the ping Module)

Confirm that Ansible can actually connect to the server listed in the Inventory.

```bash
ansible all -i inventory.ini -m ping
```

`-m ping` specifies **Ansible's `ping` module**, not the ICMP `ping` command. It's Ansible's own module for confirming that the SSH connection and Python execution work correctly. Success looks like this:

```
node1 | SUCCESS => {
    "ansible_facts": {
        "discovered_interpreter_python": "/usr/bin/python3"
    },
    "changed": false,
    "ping": "pong"
}
```

Getting back `"ping": "pong"` confirms that the SSH connection from `control` to `node1`, and its Python runtime, are working correctly.

<details>
<summary>Note: why "running Python" is part of how Ansible works at all</summary>

Ansible doesn't just SSH into `node1` — it actually **executes a Python script on `node1` itself.** When the `ansible.builtin.apt` module installs Nginx, for example, Ansible transfers the Python script backing that module to `node1` behind the scenes, runs it there with `node1`'s own Python interpreter, and gets back the result (whether it was already installed, or newly installed) as JSON. **This step — actually running Python on `node1` — is exactly what lets Ansible be more than an automated SSH command runner (a glorified shell script): it's what makes idempotency possible, by checking the current state before deciding what, if anything, needs to change.** The `"discovered_interpreter_python": "/usr/bin/python3"` you saw in the result above is Ansible reporting where it auto-detected the Python interpreter on `node1`. Since Ubuntu Server ships with Python 3 preinstalled, this all worked here with no extra setup.

</details>

## Step 4: Writing a Playbook

Write a **Playbook** that installs Nginx, starts it, and deploys a simple test page.

```bash
nano site.yml
```

```yaml
---
- name: Basic web server setup
  hosts: webservers
  become: true   # Run with administrator (sudo) privileges
  tasks:
    - name: Install Nginx
      ansible.builtin.apt:
        name: nginx
        state: present
        update_cache: true

    - name: Start Nginx and enable it on boot
      ansible.builtin.service:
        name: nginx
        state: started
        enabled: true

    - name: Deploy a test page
      ansible.builtin.copy:
        content: "<h1>Hello from Ansible!</h1>\n"
        dest: /var/www/html/index.html
```

`become: true` declares that the whole set of Tasks should run with administrator (`sudo`) privileges. Each of the three Tasks — installing a package, starting a service, deploying a file — is an instance of the "state declaration" covered in [the prerequisites article](/en/articles/ansible-guide).

## Step 5: Running the Playbook

```bash
ansible-playbook -i inventory.ini site.yml
```

**If the user on `node1` isn't configured for passwordless `sudo` (`NOPASSWD`), this command fails with `"msg": "Missing sudo password"`.** That's because `become: true` in the Playbook requires elevating to administrator privileges (`sudo`), but Ansible has no password to supply for it. In that case, run it with the `-K` (`--ask-become-pass`) option instead, which interactively prompts you for the `sudo` password.

```bash
ansible-playbook -i inventory.ini site.yml -K
```

Running it displays a color-coded `changed` or `ok` result for each Task. Since Nginx isn't installed yet on the first run, all three Tasks should be reported as `changed` (yellow). The `PLAY RECAP` shown at the end gives you a summary like `ok=4 changed=3`.

Once it succeeds, check from `control` whether the test page is actually being served.

```bash
curl http://<node1's IP>/
```

If `<h1>Hello from Ansible!</h1>` comes back, the configuration pushed by the Playbook is actually in effect.

## Step 6: Confirming Idempotency With Your Own Eyes

Now actually confirm the idempotency covered in [the prerequisites article](/en/articles/ansible-guide). **Run the exact same Playbook again, without changing a single thing.**

```bash
ansible-playbook -i inventory.ini site.yml
```

Check the result of this second run. This time, `PLAY RECAP` should show something like `ok=4 changed=0`. **Confirm that all three Tasks — "Install Nginx," "start it," "deploy it" — are now reported as `ok` (already in the desired state), not `changed`.** This is live proof that each of Ansible's Modules internally guarantees idempotency.

<details>
<summary>Extra: Deliberately making a Playbook non-idempotent</summary>

To feel just how much idempotency matters, try adding a Task that uses the `shell` module to append to a file via a raw shell command, instead of the `copy` module.

```yaml
    - name: (Bad example) Append to a file
      ansible.builtin.shell: echo "test" >> /var/www/html/index.html
```

Since this Task runs a raw shell command via the `ansible.builtin.shell` module, Ansible has no way to judge "is this already in the desired state?" As a result, **it gets reported as `changed` every single time you run it**, and you'll see the file grow one more `test` line each time. This is a textbook example of a Task that doesn't guarantee idempotency. In practice, when you do need `shell` or `command`, you have to manually compensate for idempotency yourself, using options like `creates` or `changed_when`.

</details>

## Step 7: Cleaning Up

If you don't plan to reuse these VMs for a later exercise, it's fine to just leave the hands-on setup as it is. If you'd like to stop Nginx, you can write and run a Playbook for that on the spot, too.

```yaml
---
- name: Stop Nginx
  hosts: webservers
  become: true
  tasks:
    - name: Stop Nginx and disable it on boot
      ansible.builtin.service:
        name: nginx
        state: stopped
        enabled: false
```

You'll notice you're already getting used to the idea of **writing cleanup as a Playbook too**, rather than SSHing into a server and manually running `systemctl stop nginx`.

## Common Errors and How to Handle Them

- **`UNREACHABLE` appears, and the SSH connection fails**: Check that the SSH key authentication from Step 1 is set up correctly. Also, the confirmation prompt asking whether to save the host key — normally shown the first time you SSH into `node1` — doesn't appear when Ansible runs it, which can be a cause of failure. Manually run `ssh <node1's username>@<node1's IP>` once beforehand to accept the host key.
- **`Permission denied (publickey,password)` appears, and it's trying to connect as an unexpected user (such as `root`)**: In Step 2's Inventory file, check the spelling of `ansible_user` character by character (for a typo like `ansilbe_user`). If the key name isn't recognized correctly, Ansible treats it as if no username were specified, falls back to whatever default user it connects as (often `root`), and gets rejected because that user's public key was never registered.
- **An error related to Python execution appears**: Check that Python 3 is installed on `node1` (Ubuntu Server usually has it by default). If Python's path is different in an unusual environment, add `ansible_python_interpreter=/usr/bin/python3` to the Inventory.
- **A Task using the `apt` module fails with a permission error**: Check whether `become: true` is set on the Playbook side, and whether the user on `node1` is configured to run `sudo` without a password (`NOPASSWD`), using `sudo -l`.
- **`"msg": "Missing sudo password"` appears, and the Playbook run fails**: This happens because the user on `node1` isn't configured for `NOPASSWD`. As covered in Step 5, run `ansible-playbook` with the `-K` (`--ask-become-pass`) option and enter the `sudo` password interactively. If typing the password every time is too tedious, you can also add a `NOPASSWD` entry for that user on `node1` with `visudo`.

## Summary

- Using existing Ubuntu Server VMs, you did two pieces of prep: installing Ansible on the control node, and setting up SSH key authentication.
- Defining managed nodes in an Inventory and checking connectivity with `ansible ... -m ping` lets you verify beforehand that the SSH connection and Python runtime work.
- A Playbook declares the "final state" in YAML, and is run with the `ansible-playbook` command.
- Running the same Playbook twice — seeing `changed` the first time and `ok` (`changed=0`) the second time — lets you confirm with your own eyes that idempotency is actually working.

**What to Keep in Mind From Today**
1. After writing a Playbook, build the habit of always running it twice in a row and confirming the second run shows `changed=0`.
2. Whenever you're tempted to reach for the `shell` or `command` module, get in the habit of first checking whether a dedicated module exists (`apt`, `service`, `copy`, and so on) — a dedicated module automatically guarantees idempotency for you.

## References

- [Ansible Documentation](https://docs.ansible.com/)
- [Ansible: Building an inventory](https://docs.ansible.com/ansible/latest/inventory_guide/intro_inventory.html)
- [Ansible: ansible.builtin.service module](https://docs.ansible.com/ansible/latest/collections/ansible/builtin/service_module.html)
