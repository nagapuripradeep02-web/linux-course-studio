---
name: setup
description: One-time machine setup and health check for the Linux Foundations video pipeline (Node, Python, ffmpeg, Docker lab, Kokoro voice, Remotion). Use right after cloning, before the first /lesson on a machine, or whenever a tool is "not installed", "not found" or the lab desktop is down.
argument-hint: [check]
---

# /setup — get this machine ready

Goal: at the end, `python tools/check.py` style confidence that every stage works, and the instructor knows what (if
anything) they must install by hand. Run commands from the repo root. On Windows use **Git Bash** (comes with Git for
Windows); PowerShell cannot run `lab/setup.sh`.

If `$ARGUMENTS` is `check`, only run the checks (step 1 and step 6) and report.

## 1. Find what is installed
Run, and read every line (don't assume):
```
git --version; node -v; npm -v; python --version; ffmpeg -version | head -1; ffprobe -version | head -1
docker --version; docker info --format '{{.ServerVersion}}'
```
Required: Node ≥ 20, Python ≥ 3.10, ffmpeg + ffprobe, Docker Desktop **running** (the `docker info` line must print a
version), Git. If something is missing, tell the instructor exactly what to install, with the official download page,
in one short list — then stop and wait. Do not try to install system software yourself.
- Node: https://nodejs.org (LTS) · Python: https://www.python.org/downloads (tick "Add to PATH") ·
  ffmpeg: https://www.gyan.dev/ffmpeg/builds/ (Windows) or `brew install ffmpeg` (macOS) ·
  Docker Desktop: https://www.docker.com/products/docker-desktop/ · Git: https://git-scm.com
- Disk: ~6 GB free (desktop image ~2 GB, voice model ~0.4 GB, Chromium for rendering ~0.3 GB, renders).
- RAM: 8 GB works with `--concurrency 2`; 16 GB is comfortable.

## 2. Studio (Remotion)
```
cd studio && npm install && cd ..
python tools/use.py 1.1
python tools/studio.py tsc
```
`tsc` must print nothing. The first render later downloads Remotion's headless Chromium automatically.

## 3. Voice tools
```
python -m venv voice/.venv
voice/.venv/Scripts/python -m pip install -q --upgrade pip        (macOS/Linux: voice/.venv/bin/python)
voice/.venv/Scripts/python -m pip install -q kokoro soundfile faster-whisper
```
Then warm the models once (they download on first use, ~0.4 GB + ~0.5 GB):
```
voice/.venv/Scripts/python voice/tts.py --samples
```
This writes 7 voice samples to `voice/out/samples/` (the course uses `am_michael`). If `kokoro` fails to install on this
Python version, try Python 3.11/3.12; report the exact error if it still fails.

## 4. The Ubuntu lab
```
bash lab/setup.sh
```
~5 minutes the first time. It ends with `lab ready`. Open http://localhost:3000 in a browser to *see* the desktop
(the instructor may enjoy this). If it fails: Docker Desktop not running is the usual cause. If the desktop later
disappears, never `docker start linux-lab`; run `bash lab/setup.sh` again.

## 5. Prove the whole chain on the reference lesson (optional but recommended, ~15 min)
```
python lab/record.py terminal
voice/.venv/Scripts/python voice/tts.py --only s11,s12
python tools/studio.py frames 0-60 out/1.1/smoke.mp4
```
Then open `out/1.1/smoke.mp4` or read a frame from it. Lesson 1.1's full media is also attached to the GitHub release
(`lesson-1.1-media.zip`): unzip it into the repo root to get `studio/public/1.1/` and `studio/src/data/1.1/` without
re-recording, so `python tools/studio.py open` shows the finished lesson.

## 6. Report
Tell the instructor, in plain words: what is installed and working, what you installed, anything they must still do,
and that the next step is `/lesson 1.2` (in a fresh session). Keep it under 12 lines.
