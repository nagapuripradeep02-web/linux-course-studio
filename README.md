# Linux Foundations — video studio

This project makes the course videos. You write (or approve) the words; Claude records a real Ubuntu desktop,
adds the narration and the graphics, reviews the result and gives you the finished MP4 with subtitles.
**Lesson 1.1 was made with it** (8:49): see the Releases page of this repository for the video.

You don't need to know how any of the code works. You talk to Claude in VS Code with four commands:

| You type | What happens |
|---|---|
| `/setup` | checks your computer and installs what the project needs (once) |
| `/lesson 1.2` | makes Lesson 1.2 from start to finish (asks you 2–3 questions, then shows you the script to approve) |
| `/voice 1.2 C:\path\to\takes` | replaces the AI voice with your own recordings and rebuilds the video |
| `/review 1.2` | an independent, critical review of a finished video |

## 1. Install these first (about 30 minutes)
1. **Git** — https://git-scm.com (Windows: keep "Git Bash" selected during install)
2. **Node.js LTS** — https://nodejs.org
3. **Python 3.12** — https://www.python.org/downloads (Windows: tick **Add python.exe to PATH**)
4. **ffmpeg** — Windows: https://www.gyan.dev/ffmpeg/builds/ ("release essentials" zip; add its `bin` folder to PATH) · macOS: `brew install ffmpeg`
5. **Docker Desktop** — https://www.docker.com/products/docker-desktop/ (start it; it must be running when you make videos)
6. **VS Code** — https://code.visualstudio.com — then install the **Claude Code** extension
   (https://marketplace.visualstudio.com/items?itemName=anthropic.claude-code) and sign in with your Claude account.

You need about 6 GB of free disk space and ideally 16 GB of RAM (8 GB works, renders are slower).

## 2. Get the project
In VS Code: **File → New Window**, then **Clone Git Repository…**, paste this repository's URL, choose a folder such as
`C:\Courses\`, and open it when asked. (Or in a terminal: `git clone <url>` and open the folder in VS Code.)

## 3. Set up once
Open the Claude Code panel (the Claude icon in the sidebar), type **`/setup`** and press Enter. Claude checks every tool,
installs the project's parts, builds the Ubuntu lab and tells you if anything is missing. ~15 minutes, mostly downloads.

## 4. Make a lesson
1. Start a **new chat** (`/clear`) — one lesson per chat keeps Claude sharp and costs less.
2. Type **`/lesson 1.2`**. Add a sentence if you want: `/lesson 1.2 keep the history part short, spend longer on the terminal`.
3. Answer the 2–3 questions (the recommended choice is fine).
4. **Approve the script.** This is the one moment to change words: later changes mean re-recording.
5. Wait. Recording, voice, editing, reviewing and rendering take about 2–3 hours, mostly unattended; Claude reports at each
   checkpoint. You can close the laptop lid and come back; just don't close VS Code.
6. Watch `out/1.2/Lesson-1.2.mp4` (and the 720p copy on your phone). Tell Claude what to change in plain words:
   *"the timeline slide moves too fast"*, *"zoom in more on the os-release output"*, *"my name is pronounced wrong"*.

What you get in `out/<lesson>/`: the MP4 (1080p) and a 720p copy, subtitles (`.srt`, `.vtt`), a transcript, chapter
markers, a thumbnail, and `script-to-read.md` for recording your voice.

## 5. Put your own voice in
Read `RECORDING_GUIDE.md` (10 minutes). Record one short file per section from `script-to-read.md`, put them in a folder,
then type **`/voice 1.2 C:\path\to\that\folder`**. Everything re-syncs to your words automatically. You can also choose
"import my takes" when `/lesson` asks about the voice, and record first.

## 6. Talking to Claude (tips)
- Be concrete and point at a moment: *"at 3:10 the box covers the command"*. Claude can show you any frame.
- Ask it to explain anything it did; ask *"what would you improve?"*; ask for `/review 1.2` before publishing.
- It never fakes terminal output. If something can't be shown truthfully in the lab, it will say so and propose an alternative.
- One lesson ≈ a few hours of your Claude plan's usage (roughly US$10–15 if paid per use). Lesson 1.1 cost more because the
  whole pipeline was being built.

## Troubleshooting
| Problem | Fix |
|---|---|
| "Docker is not running" / lab not found | start Docker Desktop, then tell Claude to run `bash lab/setup.sh` |
| Lab desktop disappeared after a reboot | same: `bash lab/setup.sh` (never "start" the old container) |
| Render crashed or the PC froze | tell Claude: *"render with concurrency 2"* |
| A word is mispronounced | tell Claude the word; it adds a pronunciation rule and regenerates that section |
| Claude seems lost mid-lesson | `/clear`, then `/lesson 1.2` again — it detects where it stopped and continues |
| Want to see the finished Lesson 1.1 in the editor | download `lesson-1.1-media.zip` from Releases, unzip into the project folder, then ask Claude to open the studio |

## What's inside (for the curious)
Real Ubuntu desktop in Docker, driven by scripts and recorded with ffmpeg · Kokoro AI voice (or yours) with word-level
timing · Remotion (React) for the graphics and the final cut, every element timed from the spoken words · Python tools
for rendering, captions and quality checks. `CLAUDE.md` holds the production rules Claude follows; `.claude/skills/`
holds the four commands. All tools are free/open source; Remotion is free for teams of up to three people.
