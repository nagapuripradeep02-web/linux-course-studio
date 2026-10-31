<!-- Extracted from course/Module 1 - Introduction to Operating Systems and Linux.docx (the instructor's course plan). -->
<!-- Claude reads this to author each lesson; the .docx stays the human-edited original. -->

# Linux Course – Module 1: Introduction to Operating Systems and Linux

Course production pack: lesson plans, narration scripts (also your website transcripts), quizzes, labs and real-world scenarios.

## How to use this pack

Module 1 has six lessons. Each lesson has the same parts, so you can reuse the template for Modules 2 to 10:

- At a glance: target length and the learning objective
- Slides and graphics: what appears on screen
- Demo commands: what to type in the terminal
- Narration script: read it aloud (or feed it to an AI voice). The same text is the transcript on your website and the source for subtitles

Cues in the scripts: [SLIDE] show a slide, [TERMINAL] switch to the terminal, [PAUSE] let the output sit for two seconds.

Lesson

Title

Target length

1.1

What is an operating system?

8 min

1.2

How Linux came into existence

9 min

1.3

Linux distributions

8 min

1.4

Open source and licensing

7 min

1.5

Setting up your Linux lab

10 min

1.6

The Linux file system hierarchy

12 min

## Producing the videos without a virtual machine

Honest summary: AI cannot record a real terminal session for you, but it can remove most of the heavy work. A practical pipeline:

- Script: written here (done for Module 1).
- Voice: either record your own voice (more personal, and learners trust a real instructor), or generate narration from the script with an AI text-to-speech tool such as ElevenLabs, Azure Neural TTS or Google Cloud TTS. Check each tool’s current commercial-use terms before publishing.
- Slides: paste the slide outlines into Canva, Gamma or PowerPoint Designer and let them generate the layouts. Keep one template for all ten modules.
- Terminal footage without a VM: use WSL2 on your Windows 11 machine. It installs in about ten minutes and runs real Ubuntu, so no VirtualBox is needed. Then either:
- record the terminal window with OBS Studio, or
- use VHS (by Charm), which reads a small script file (a “tape”) that types the commands automatically and exports a clean MP4, WebM or GIF. This is the closest thing to “generating” terminal videos, and I can write the tape files for you.
- for text-based playback on your website, asciinema recordings are tiny, sharp, and let learners copy commands.
- Optional AI presenter: tools such as HeyGen or Synthesia can turn the script into a talking-avatar video. This suits intro and concept lessons; for terminal demos, screen footage works better.
- Assembly and subtitles: put voice, slides and terminal clips together in DaVinci Resolve, Camtasia or CapCut. Because you already have the script, subtitles can be built from it directly.

To set up WSL2, open PowerShell as Administrator and run wsl --install -d Ubuntu, then restart. wsl --list --online shows other distributions you can add for the distro-comparison lesson. A real VM is only needed later, for boot-process and GRUB topics in Module 5.

## Lesson 1.1: What is an operating system?

At a glance: 8 minutes. After this lesson the learner can explain what an operating system does and name the kernel, shell and user space.

Slides and graphics

- Title slide with the module name
- Diagram: layers from top to bottom (applications, shell, kernel, hardware)
- Slide with the four jobs of an OS: process management, memory management, file systems, device control
- Examples: Windows, macOS, Android, Linux, with a note that Android runs on a Linux kernel
- Recap slide

Demo commands (run in WSL or any Linux terminal)

```
uname -a
uname -r
echo $SHELL
ps aux | head -5
free -h
```

### Narration script

[SLIDE 1] Welcome to the course. In this first module we build the foundation: what an operating system is, where Linux came from, and how you set up a lab to practise. By the end of this lesson you will be able to explain what an operating system does and name its main parts.

[SLIDE 2] Let’s start with a simple question. When you turn on a computer, who decides which program gets the processor, where files are stored, and what happens when you plug in a USB drive? The answer is the operating system, or OS.

Think of the OS as the manager between you and the hardware. At the bottom is the hardware: processor, memory, disks and network cards. At the top are applications, like a browser or a text editor. In between sits the operating system, and applications never talk to the hardware directly. They ask the OS, and the OS does the work.

[SLIDE 3] An operating system has four main jobs. First, process management: it decides which program runs, when, and for how long. Second, memory management: it gives each program its own memory and stops one program from damaging another. Third, file systems: it organises data on disks into files and directories. And fourth, device control: it talks to keyboards, disks and network cards through drivers.

Now, two terms matter a lot in Linux: the kernel and the shell. The kernel is the core of the operating system. It runs with full access to hardware and performs those four jobs. The shell is the program that lets you type commands and hands them to the kernel. Everything else, your applications and tools, lives in what we call user space.

[SLIDE 4] You already use operating systems every day. Windows and macOS on laptops, Android and iOS on phones, and Linux on servers, cloud platforms, routers, and even smart TVs. In fact, Android is built on the Linux kernel, and most of the internet’s servers run Linux. That is why Linux skills are so valuable.

[TERMINAL] Let’s see this on a real system. I’ll open a terminal. The command uname -a prints information about the system. [PAUSE] Here you can see the word Linux, the machine name, and the kernel version. If I type uname -r, I get just the kernel release. [PAUSE]

Next, echo dollar SHELL tells me which shell I’m using. [PAUSE] On most systems this is bash. That’s the program reading what I type right now.

Let me list a few processes with ps aux, piped into head. [PAUSE] Each line is a program the kernel is managing. And free -h shows memory: how much exists and how much is in use. [PAUSE] This is the memory management job, visible in one command.

[SLIDE 5] To recap: the operating system manages hardware for applications. The kernel is its core, the shell is how we talk to it, and user space is where programs run. In the next lesson we will go back in time and see how Linux came into existence. See you there.

## Lesson 1.2: How Linux came into existence

At a glance: 9 minutes. After this lesson the learner can describe the path from Unix to GNU to Linux and explain why Linux is called GNU/Linux by some people.

Slides and graphics

- Timeline graphic: 1969 Unix, 1983 GNU project, 1991 Linux kernel, 1990s distributions, today (cloud, Android, supercomputers)
- Portrait-free slide with names only: Ken Thompson and Dennis Ritchie (Unix), Richard Stallman (GNU), Linus Torvalds (Linux)
- Diagram: GNU tools + Linux kernel = a complete operating system
- Map or icons: where Linux runs today

Demo commands

```
cat /etc/os-release
uname -r
ls /boot
man man | head -20
```

### Narration script

[SLIDE 1] To understand Linux, we need to start before Linux existed. In 1969, engineers at Bell Labs, including Ken Thompson and Dennis Ritchie, created an operating system called Unix. It introduced ideas we still use: a tree of files and directories, small tools that do one job well, and the ability to connect those tools together. In the 1970s Unix was rewritten in the C language, which made it portable to different machines. Universities and companies adopted it quickly.

But Unix became commercial and expensive, and its source code was restricted.

[SLIDE 2] In 1983, Richard Stallman started the GNU project. GNU stands for “GNU’s Not Unix”. The goal was to build a completely free operating system, free meaning you can use it, study it, change it and share it. By the early 1990s the GNU project had produced many of the essential parts: a compiler, the bash shell, core utilities like ls and cp, and editors. But one big piece was missing: a working kernel.

In 1991, a Finnish student named Linus Torvalds announced a hobby project: a new kernel for PC computers. He shared the source code online and invited others to help. That kernel became Linux.

[SLIDE 3] Here’s the key point. Linux, strictly speaking, is only the kernel. Combine the Linux kernel with the GNU tools and you get a complete, free operating system. That’s why some people say GNU/Linux. In everyday speech, we simply say Linux.

Over the 1990s, groups packaged the kernel, the tools and installers together. Those packages are called distributions, and we will meet them in the next lesson.

[SLIDE 4] Today Linux runs almost everywhere: the majority of web servers, all of the top supercomputers, cloud platforms, Android phones, routers, cars and televisions. A kernel started by one student is now developed by thousands of engineers and companies around the world.

[TERMINAL] Let’s look at the result on a real machine. The file /etc/os-release describes the distribution. [PAUSE] Here you can see the name and version. And uname -r shows the Linux kernel version we’re running. [PAUSE]

Let me also look inside the boot directory with ls /boot. [PAUSE] Among these files you’ll often find the kernel image itself, usually named vmlinuz. That file is the Linux kernel Linus began in 1991, many versions later.

And you’ll also notice the manual pages: man man explains the manual system. [PAUSE] The manual is a descendant of the original Unix documentation, and you will use it all the time.

[SLIDE 3] To recap: Unix gave us the design, GNU gave us the free tools, and Linus Torvalds gave us the kernel. Together they became the Linux we use today. Next, we will look at distributions, the different flavours of Linux.

## Lesson 1.3: Linux distributions

At a glance: 8 minutes. After this lesson the learner can explain what a distribution is, name the main families, and choose one for learning.

Slides and graphics

- Diagram: kernel + GNU tools + package manager + installer = a distribution
- Family tree: Debian → Ubuntu → Linux Mint; Red Hat → Fedora, RHEL, Rocky Linux, AlmaLinux; SUSE → openSUSE, SLES; Arch → Manjaro
- Comparison table (below) shown one row at a time
- Decision slide: “Which one should I pick?”

Family

Examples

Package tool

Typical use

Debian

Debian, Ubuntu, Mint

apt, dpkg

Servers, desktops, cloud, beginners

Red Hat

RHEL, Fedora, Rocky, AlmaLinux

dnf, rpm

Enterprise servers, data centres

SUSE

SLES, openSUSE

zypper, rpm

Enterprise, SAP workloads

Arch

Arch, Manjaro

pacman

Enthusiasts, rolling releases

Demo commands

```
cat /etc/os-release
which apt dnf zypper
apt --version
```

### Narration script

[SLIDE 1] In the last lesson we learned that Linux is a kernel. But nobody installs just a kernel. A distribution, or distro, is a complete package: the Linux kernel, the GNU tools, a package manager to install software, an installer, and usually a default set of applications and a support policy. Different groups build different distributions for different needs.

[SLIDE 2] There are hundreds of distributions, but most fall into a few families. The Debian family includes Debian itself, Ubuntu and Linux Mint. They use the apt package manager. Ubuntu is the most popular choice on cloud servers and for learners.

The Red Hat family includes Red Hat Enterprise Linux, or RHEL, plus Fedora, Rocky Linux and AlmaLinux. These use dnf and the rpm package format. Many large companies run RHEL or one of its compatible clones, so if you work in enterprise IT, you will meet this family.

The SUSE family, with SUSE Linux Enterprise and openSUSE, is common in enterprise environments, especially around SAP. And Arch Linux is a minimalist, rolling-release distribution that attracts enthusiasts who like to build their system piece by piece.

[SLIDE 3] The practical difference for you is mostly the package manager and the release policy. Some distributions release new versions every six months, others support one version for ten years. Enterprises prefer long support. Developers often prefer newer software.

[TERMINAL] Let’s see the family we are on. cat /etc/os-release prints the name and version. [PAUSE] Look at the ID_LIKE line: it tells us the family. Now which apt dnf zypper checks which package managers exist. [PAUSE] On an Ubuntu system, only apt appears. On a RHEL-style system you would see dnf instead. And apt --version confirms which one we have. [PAUSE]

[SLIDE 4] So, which one should you choose? For this course, we use Ubuntu, because it is widely available, well documented and easy to install. Where RHEL-style commands differ, I will show both. The core skills you learn transfer to every distribution, because they all share the same kernel and the same fundamental tools.

In the next lesson we look at the idea that made all this possible: open source.

## Lesson 1.4: Open source and licensing

At a glance: 7 minutes. After this lesson the learner can explain the four freedoms, the difference between GPL and permissive licences, and why it matters for business use.

Slides and graphics

- Four freedoms graphic (use, study, share, modify)
- Side-by-side: copyleft (GPL) versus permissive (MIT, Apache 2.0, BSD)
- How Linux makes money: support subscriptions, cloud services, hardware vendors, consulting
- Recap

Demo commands

```
ls /usr/share/common-licenses
head -n 15 /usr/share/common-licenses/GPL-2
```

### Narration script

[SLIDE 1] Linux is open source software. That means its source code is public, and the licence gives you specific freedoms. The Free Software Foundation describes four: the freedom to run the software for any purpose, to study how it works, to share copies, and to modify it and share your changes.

This is why thousands of companies and volunteers can improve Linux together, and why you can use it without paying a licence fee.

[SLIDE 2] Open source licences come in two broad styles. Copyleft licences, such as the GNU General Public License, or GPL, say: you can modify and distribute this, but if you distribute your changes, you must share them under the same terms. The Linux kernel uses the GPL, version 2.

Permissive licences, such as MIT, BSD and Apache 2.0, are more relaxed. You can use the code, even inside closed-source products, with few conditions, mainly keeping the copyright notice.

[TERMINAL] Your system already carries these licences. Let’s list the folder /usr/share/common-licenses. [PAUSE] Here are the texts of several licences. Let me show the beginning of the GPL version 2 with head. [PAUSE] You don’t need to memorise it. The point is that every package ships with its licence, so you can always check what you are allowed to do.

[SLIDE 3] People often ask: if Linux is free, how does anyone make money? Companies sell support and long-term maintenance, cloud services, certified hardware, training and consulting. Red Hat, SUSE, Canonical and the major cloud providers all build businesses this way.

[SLIDE 4] To recap: open source gives us the freedom to use, study, share and modify. GPL requires sharing changes, permissive licences do not, and Linux itself is GPL. Next, you will set up your own lab so you can practise every command.

## Lesson 1.5: Setting up your Linux lab

At a glance: 10 minutes. After this lesson the learner has a working Linux environment and has run their first update.

Slides and graphics

- Four lab options with pros and cons (table below)
- Screenshot sequence: WSL install, first-run username prompt, Windows Terminal with Ubuntu tab
- Tips slide: snapshots, fonts, copy and paste

Option

Best for

Pros

Cons

WSL2 (Windows 10/11)

Most learners on Windows

Fast install, light, integrates with Windows

Not a full machine; boot topics unavailable

VirtualBox or VMware VM

Full experience

Real boot process, snapshots, safe to break

Heavier, slower to set up

Cloud VM (free tier)

Learning servers and SSH

Real server, public IP, always on

Account needed, watch costs

Docker container

Quick throwaway tests

Starts in seconds

Minimal system, no systemd

Demo commands

In PowerShell as Administrator:

```
wsl --install -d Ubuntu
```

Then, inside Ubuntu:

```
lsb_release -a
sudo apt update
sudo apt upgrade -y
pwd
whoami
```

### Narration script

[SLIDE 1] To learn Linux you need to practise on a real system. You have four good options.

The first is WSL2, the Windows Subsystem for Linux. If you use Windows 10 or 11, this is the quickest way: it runs real Ubuntu inside Windows with no separate virtual machine to manage. The second is a virtual machine in VirtualBox or VMware. It takes longer to set up, but it behaves like a complete computer, and you can take snapshots and break things safely. The third is a cloud server on a free tier, which is great for learning SSH and server tasks. The fourth is Docker, handy for quick experiments.

For most of this course, WSL2 or a VM is enough. I recommend starting with WSL2 and adding a VM later when we study booting and disks.

[SLIDE 2] Let me show WSL2. Open PowerShell as Administrator, and type: wsl --install -d Ubuntu. [PAUSE] Windows downloads Ubuntu and enables the needed features. When it finishes, restart your computer if asked.

The first time Ubuntu starts, it asks for a username and password. Choose something simple. When you type the password, nothing appears on screen. That is normal, it is a security feature.

[TERMINAL] Now we are inside Ubuntu. Let’s confirm the version with lsb_release -a. [PAUSE] Good. Now the first thing every administrator does on a new system: update it. sudo apt update refreshes the list of available packages. [PAUSE] Then sudo apt upgrade -y installs the updates. The sudo word means: run this as the administrator, and it will ask for your password. [PAUSE]

Two quick checks. pwd shows your current directory, and whoami shows your user name. [PAUSE] You are now in your home directory, as your own user, on a real Linux system.

[SLIDE 3] A few tips. In Windows Terminal, increase the font size so it is easy to read. Use right-click to paste. If you use a VM, take a snapshot before experiments so you can roll back. And don’t worry about breaking things. A lab is meant for that.

In the next lesson we explore how Linux organises its files.

## Lesson 1.6: The Linux file system hierarchy

At a glance: 12 minutes. After this lesson the learner can explain the purpose of the main top-level directories and find configuration, logs, user data and device files.

Slides and graphics

- Animated tree diagram starting at / with each directory appearing as it is explained
- Table of directories and their roles (below)
- Comparison with Windows: one tree and no drive letters
- Recap and quiz teaser

Directory

Purpose

/

Root of everything

/bin, /sbin

Essential commands (on modern systems often links to /usr/bin, /usr/sbin)

/etc

System configuration files

/home

Personal directories of users

/root

Home directory of the root user

/var

Variable data: logs, caches, mail, databases

/tmp

Temporary files

/usr

Installed programs, libraries, documentation

/opt

Optional third-party software

/dev

Device files

/proc, /sys

Live information from the kernel

/mnt, /media

Mount points for disks and USB drives

/boot

Kernel and boot loader files

Demo commands

```
ls /
ls -l /bin
ls /etc | head -20
cat /etc/hostname
ls /home
ls /var/log
head -n 5 /proc/cpuinfo
ls /dev | head -15
```

### Narration script

[SLIDE 1] Now let’s look at the map of Linux: the file system hierarchy. If you come from Windows, forget drive letters like C and D. In Linux there is one single tree. It starts at the root, written as a single slash, and everything else, including other disks, hangs off that tree.

[TERMINAL] Let’s explore. ls slash lists the top-level directories. [PAUSE] Each one has a job.

[SLIDE 2] Starting with /bin and /sbin. These hold essential commands such as ls and cp. [TERMINAL] If I run ls -l /bin, you can see that on modern systems this is often a link pointing to /usr/bin. [PAUSE] Same idea, simply merged.

[SLIDE 2] Next is /etc. This is where system configuration lives, as plain text files. [TERMINAL] ls /etc piped to head shows a few. [PAUSE] And cat /etc/hostname shows the name of this machine. [PAUSE] When an administrator wants to change how a service behaves, the answer is almost always: edit a file in /etc.

[SLIDE 2] /home contains a directory for each user, where documents and personal settings are stored. [TERMINAL] ls /home shows ours. [PAUSE] The administrator has their own home at /root, not inside /home.

[SLIDE 2] Then /var, for variable data, files that change while the system runs. Most important for you: logs. [TERMINAL] ls /var/log shows log files. [PAUSE] When something breaks, this is the first place you look.

[SLIDE 2] /usr holds installed programs and libraries, and /opt is for optional third-party software. /tmp is for temporary files, which may be cleared at reboot. /boot holds the kernel and the boot loader files.

[SLIDE 2] Now two special ones. /proc and /sys are not real files on disk. They are windows into the running kernel. [TERMINAL] Let me show head -n 5 /proc/cpuinfo. [PAUSE] That is live information about the processor, generated on the fly.

And /dev contains device files. [TERMINAL] ls /dev piped to head. [PAUSE] In Linux, hardware is presented as files: disks, terminals and more. This is the Unix idea that everything is a file.

[SLIDE 3] So, to compare with Windows: one tree, no drive letters, configuration in /etc, user data in /home, logs in /var/log, and devices in /dev.

[SLIDE 4] To recap: the root slash is the top, /etc is configuration, /home is users, /var is changing data and logs, /usr is programs, and /proc and /dev expose the kernel and hardware. In Module 2 we start using the command line seriously: navigating, creating and managing files. Great work finishing Module 1.

## Module 1 quiz (10 questions)

Use these on the website as multiple choice. Correct answers are marked, with the explanation to show after the learner answers.

- Which component of the OS has full access to the hardware? (a) Shell (b) Kernel (c) Browser (d) Terminal. The kernel is the core that manages hardware; the shell only passes your commands to it.
- Which command prints the kernel release? (a) whoami (b) pwd (c) uname -r (d) free -h.
- Which project supplied the free tools such as the compiler and bash? (a) Unix (b) GNU (c) Android (d) Fedora.
- In what year did Linus Torvalds announce the Linux kernel? (a) 1969 (b) 1983 (c) 1991 (d) 2004.
- What is a Linux distribution? (a) Only the kernel (b) A hardware vendor (c) A kernel plus tools, a package manager and an installer (d) A type of file system.
- Which package manager belongs to the Debian family? (a) dnf (b) zypper (c) pacman (d) apt.
- Which licence style requires you to share your changes when you distribute the software? (a) MIT (b) GPL (c) BSD (d) Apache 2.0.
- Where do system configuration files live? (a) /var (b) /tmp (c) /etc (d) /dev.
- Where would you first look for log files? (a) /boot (b) /var/log (c) /usr/bin (d) /home.
- What do /proc and /sys provide? (a) Backup copies (b) User documents (c) Installed programs (d) Live information from the running kernel.

## Module 1 hands-on lab

Goal: prove your lab works and explore the system.

- Install your lab (WSL2 or a VM) and run sudo apt update && sudo apt upgrade -y.
- Record the output of uname -r, cat /etc/os-release and free -h in a text file called module1-notes.txt. Use echo or a text editor; copy and paste is fine for now.
- Find and write down: your machine’s hostname, the name of one file in /etc, one file in /var/log, and your home directory path.
- Answer in one sentence each: which package manager does your system use, and which licence does the kernel use?

Self-check: you can explain each answer to a friend without looking at the notes.

## Real-world scenarios for Module 1

These are the five troubleshooting scenarios for your simulator and for short “how we actually fix it” videos. Each has the same structure: symptom, diagnosis, root cause, fix, verification.

### Scenario 1: “Which system did I just inherit?”

- Symptom: you are given SSH access to an unknown server and have to report the OS, version, kernel and package manager.
- Diagnosis: cat /etc/os-release, uname -r, which apt dnf zypper.
- Root cause: none, this is a fact-finding task every administrator does first.
- Fix and verify: write the findings in a short report; confirm the package manager by running its --version command.
- Simulator check: the learner must type the correct distro name and package manager.

### Scenario 2: “apt update says permission denied”

- Symptom: E: Could not open lock file /var/lib/apt/lists/lock - open (13: Permission denied).
- Diagnosis: run whoami and see you are a normal user; package changes need administrator rights.
- Root cause: the command was run without sudo.
- Fix: sudo apt update.
- Verify: the command finishes with a list of fetched packages and no error.

### Scenario 3: “tree: command not found”

- Symptom: the learner runs tree / and gets command not found.
- Diagnosis: which tree prints nothing, so the program is not installed; apt search tree shows the package.
- Root cause: a minimal install does not include every tool.
- Fix: sudo apt install tree.
- Verify: tree -L 1 / prints the top-level directories.

### Scenario 4: “I can’t find the machine’s name or its logs”

- Symptom: a manager asks for the hostname and the location of the system logs for a ticket.
- Diagnosis: apply the file system hierarchy: configuration is in /etc, logs in /var/log.
- Fix: cat /etc/hostname, ls /var/log, hostname.
- Verify: both values match the ones shown by hostnamectl if systemd is available.

### Scenario 5: “WSL will not install”

- Symptom: wsl --install fails with a message about virtualization not being enabled.
- Diagnosis: check Task Manager, Performance tab, CPU: “Virtualization” should say Enabled; check that the Windows features “Virtual Machine Platform” and “Windows Subsystem for Linux” are on.
- Root cause: hardware virtualization is turned off in the BIOS or UEFI settings, or the Windows features are not enabled.
- Fix: enable virtualization in the BIOS or UEFI, enable the two Windows features, restart, and run wsl --install -d Ubuntu again.
- Verify: wsl --list --verbose shows Ubuntu with version 2.

### Example simulator data for Scenario 2

A simple JSON structure you can adapt for the simulator, where each scenario has a starting state, a goal and a check:

```
{
  "id": "m1-s2-apt-permission",
  "title": "apt update says permission denied",
  "user": "learner",
  "startState": { "cwd": "/home/learner", "isRoot": false },
  "briefing": "You ran apt update and got a permission error. Fix it.",
  "hints": ["Who are you running this as?", "Which word gives you administrator rights?"],
  "successWhen": { "commandMatches": "^sudo apt update$" },
  "explanation": "Package operations change system files, so they need administrator rights. Prefix the command with sudo."
}
```

## Sample VHS script for Lesson 1.1 (terminal clip without a VM)

Run this inside WSL after installing VHS (follow the install steps in the VHS project’s README). It types the commands for you and produces an MP4 you can drop into your editor:

```
Output lesson-1-1.mp4
Set FontSize 24
Set Width 1280
Set Height 720
Set TypingSpeed 70ms

Type "uname -a"
Enter
Sleep 3s
Type "uname -r"
Enter
Sleep 2s
Type "echo $SHELL"
Enter
Sleep 2s
Type "ps aux | head -5"
Enter
Sleep 3s
Type "free -h"
Enter
Sleep 4s
```

Run it with vhs lesson-1-1.tape. Adjust the Sleep times so they match the pauses in the narration.

## Recording checklist per lesson

- Read the narration once aloud and mark where you need to breathe or slow down.
- Record slides and narration first, then terminal clips, then combine.
- Terminal font at least 20 pt, dark theme, clean prompt (a short prompt like $ is easier to read).
- Export subtitles from the script and place the script on the lesson page as the transcript.
- Add the quiz and the lab link under each video.

## Next steps

- Review the six lessons and tell me what to change: tone, length, level of detail, examples.
- Pick the voice approach (your voice or AI voice) and I will adjust the scripts to match, for example shorter sentences for text-to-speech.
- When you are ready, I will produce Module 2 (command line basics and file management) in the same format, plus VHS tape files and simulator scenarios.
