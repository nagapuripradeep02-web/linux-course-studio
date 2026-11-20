# Linux Foundations — video studio

This project makes the course videos. You write (or approve) the words; Claude records a real Ubuntu desktop,
adds the narration and the graphics, reviews the result and gives you the finished MP4 with subtitles.
**Lessons 1.1 (8:49) and 1.2 (10:11) were made with it** (the finished videos are part of the paid course and are shared
with the instructor privately, not published here).

You don't need to know how any of the code works. You talk to Claude in VS Code with four commands:

| You type | What happens |
|---|---|
| `/setup` | checks your computer and installs what the project needs (once) |
| `/lesson 1.3` | makes Lesson 1.3 from start to finish (asks you 2–3 questions, then shows you the script to approve) |
| `/voice 1.2 C:\path\to\takes` | replaces the AI voice with your own recordings and rebuilds the video |
| `/review 1.3` | an independent, critical review of a finished video |

## Where things stand
| Lesson | Status |
|---|---|
| 1.1 What is an operating system? | done (AI voice) |
| 1.2 How Linux came into existence | done (AI voice) |
| 1.3 Linux distributions | **next: `/lesson 1.3`** |
| 1.4 Open source and licensing | to do |
| 1.5 Setting up your Linux lab | to do — parts need a real VM/WSL screen, which the Docker lab can't show (Claude will explain) |
| 1.6 The Linux file system hierarchy | to do |

## Quick start: one prompt does the setup
1. Install **VS Code** (https://code.visualstudio.com), **Git** (https://git-scm.com; keep "Git Bash" selected) and the
   **Claude Code** extension in VS Code (https://marketplace.visualstudio.com/items?itemName=anthropic.claude-code). Sign in
   with your Claude account.
2. Make an empty folder `C:\Courses`, open it in VS Code (**File → Open Folder**), open the Claude Code panel and paste:

```
Please set up my Linux course video studio on this computer.
1. Clone https://github.com/nagapuripradeep02-web/linux-course-studio into C:\Courses\linux-course-studio (never inside OneDrive).
2. Read README.md and CLAUDE.md in that folder, then follow every step of .claude/skills/setup/SKILL.md, running commands from that folder.
3. If something must be installed by hand (Node.js, Python, ffmpeg, Docker Desktop), give me the exact download link, wait while I install it, then check again and continue.
4. At the end, tell me in plain, short words what is ready and exactly what I do next to make Lesson 1.3.
I am a Linux teacher, not a programmer: keep explanations simple.
```

3. When it's done, open `C:\Courses\linux-course-studio` in VS Code (**File → Open Folder**), start a new Claude chat there
   and type **`/lesson 1.3`**. (The `/lesson`, `/voice`, `/review` commands only appear when this folder is the one open.)

The sections below explain the same steps by hand.

## 1. Install these first (about 30 minutes)
1. **Git** — https://git-scm.com (Windows: keep "Git Bash" selected during install)
2. **Node.js LTS** — https://nodejs.org
3. **Python 3.12** — https://www.python.org/downloads (Windows: tick **Add python.exe to PATH**)
4. **ffmpeg** — Windows: https://www.gyan.dev/ffmpeg/builds/ ("release essentials" zip; add its `bin` folder to PATH) · macOS: `brew install ffmpeg`
5. **Docker Desktop** — https://www.docker.com/products/docker-desktop/ (start it; it must be running when you make videos)
6. **VS Code** — https://code.visualstudio.com — then install the **Claude Code** extension
   (https://marketplace.visualstudio.com/items?itemName=anthropic.claude-code) and sign in with your Claude account.

You need about 6 GB of free disk space and ideally 16 GB of RAM (8 GB works, renders are slower).
Keep the project **outside OneDrive/Dropbox** (e.g. `C:\Courses\`): it holds thousands of small files and large videos.

## 2. Get the project
In VS Code: **File → New Window**, then **Clone Git Repository…**, paste this repository's URL, choose a folder such as
`C:\Courses\`, and open it when asked. (Or in a terminal: `git clone <url>` and open the folder in VS Code.)

## 3. Set up once
Open the Claude Code panel (the Claude icon in the sidebar), type **`/setup`** and press Enter. Claude checks every tool,
installs the project's parts, builds the Ubuntu lab and tells you if anything is missing. ~15 minutes, mostly downloads.
Claude asks permission before running commands; the common, safe ones are pre-approved in `.claude/settings.json`.

## 4. Make a lesson
1. Start a **new chat** (`/clear`) — one lesson per chat keeps Claude sharp and costs less.
2. Type **`/lesson 1.3`**. Add a sentence if you want: `/lesson 1.3 keep the comparison table short, spend longer on the terminal`.
3. Answer the 2–3 questions (the recommended choice is fine).
4. **Approve the script.** This is the one moment to change words: later changes mean re-recording.
5. Wait. Recording, voice, editing, reviewing and rendering take about 2–3 hours, mostly unattended; Claude reports at each
   checkpoint. Keep the laptop plugged in and set Windows to **not sleep** while plugged in; don't close VS Code.
6. Watch `out/1.3/Lesson-1.3.mp4` (and the 720p copy on your phone). Tell Claude what to change in plain words:
   *"the family tree slide moves too fast"*, *"zoom in more on the os-release output"*, *"my name is pronounced wrong"*.

What you get in `out/<lesson>/`: the MP4 (1080p) and a 720p copy, subtitles (`.srt`, `.vtt`), a transcript, chapter
markers, a thumbnail, and `script-to-read.md` for recording your voice.

**If it stops halfway** (laptop off, a usage limit, an error): nothing is lost. Everything is saved as files. Open a new
chat and type `/lesson 1.3` again; Claude checks what already exists and continues from there.

## 5. Put your own voice in
Read `RECORDING_GUIDE.md` (10 minutes). Record one short file per section from `script-to-read.md`, put them in a folder,
then type **`/voice 1.2 C:\path\to\that\folder`**. Everything re-syncs to your words automatically. You can also choose
"import my takes" when `/lesson` asks about the voice, and record first.

## 6. Talking to Claude (tips)
- Be concrete and point at a moment: *"at 3:10 the box covers the command"*. Claude can show you any frame.
- Ask it to explain anything it did; ask *"what would you improve?"*; ask for `/review 1.3` before publishing.
- It never fakes terminal output. If something can't be shown truthfully in the lab, it will say so and propose an alternative.
- Usage: one lesson is a long job (hundreds of steps). On the Claude Pro plan you may hit the plan's usage limit partway
  through; Claude tells you when it resets. Just come back then, open a new chat and type `/lesson 1.3` again.
  (Paid per use, a lesson is roughly US$10–15. Lesson 1.1 cost more because the whole pipeline was being built.)

## Troubleshooting
| Problem | Fix |
|---|---|
| "Docker is not running" / lab not found | start Docker Desktop, then tell Claude to run `bash lab/setup.sh` |
| Lab desktop disappeared after a reboot | same: `bash lab/setup.sh` (never "start" the old container) |
| Render crashed or the PC froze | tell Claude: *"render with concurrency 2"* |
| A word is mispronounced | tell Claude the word; it adds a pronunciation rule and regenerates that section |
| Claude seems lost, stopped, or hit a usage limit | new chat (`/clear`), then `/lesson <number>` again — it detects where it stopped and continues |
| Want to open a finished lesson (1.1, 1.2) in the editor | get that lesson's `lesson-<number>-media.zip` (shared privately), unzip it into the project folder, then ask Claude to open the studio |

## What's inside (for the curious)
Real Ubuntu desktop in Docker, driven by scripts and recorded with ffmpeg · Kokoro AI voice (or yours) with word-level
timing · Remotion (React) for the graphics and the final cut, every element timed from the spoken words · Python tools
for rendering, captions and quality checks. `CLAUDE.md` holds the production rules Claude follows; `.claude/skills/`
holds the four commands. All tools are free/open source; Remotion is free for teams of up to three people.
