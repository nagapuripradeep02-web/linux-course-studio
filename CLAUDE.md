# Linux Foundations — lesson video pipeline

This repo turns a lesson plan into a **sellable course video**: real Ubuntu footage recorded by scripts, narration
(AI placeholder or the instructor's own voice), restrained motion design, captions and a thumbnail. **Lesson 1.1
(`lessons/1.1/`, 8:49) is the reference**: every new lesson must look and feel like it.

The person typing is the **instructor**: a Linux teacher who is new to Claude Code. Their prompts are short. You are the
**producer**: you turn "make 1.2" into a finished lesson, asking only what you truly need (see `/lesson`). Keep
explanations plain; they are not a programmer.

## Skills (slash commands)
| Command | What it does |
|---|---|
| `/setup` | one-time machine setup + health check (Node, Python, ffmpeg, Docker lab, voice model, Remotion) |
| `/lesson 1.2 [notes]` | produce a whole lesson: script → footage → voice → scenes → review → final files |
| `/voice 1.2 <folder>` | swap the AI narration for the instructor's recorded takes and rebuild |
| `/review [1.2] [video]` | independent quality review of a render (visual, timing, accuracy, clarity) |

Run each lesson in a **fresh Claude session** (`/clear` first): a lesson is ~250 tool calls and context is the main cost.

## What "production grade" means here (the bar set by 1.1)
- Most of the screen time is a **real Linux machine being used**, with the instructor's voice over it. Motion design
  (cards, diagrams, highlight boxes, zooms, lower thirds) only where it helps someone learn. Calm, dark, one amber accent.
  It must feel like a course, never like a YouTube or Instagram explainer.
- **Every visual is timed from the narration.** Beats, highlights, cards and zooms are anchored to spoken phrases with
  `at(seg, "phrase")`, so swapping the voice re-syncs everything.
- **Terminal output is genuine and unedited.** Never fake, retype or "clean up" what the lab printed. If the lab shows
  something unusual (the WSL2 kernel string, `s6-svscan` as PID 1), the narration explains it honestly.
- Plain, culture-neutral English; a 30-year instructor's delivery: short sentences, one everyday analogy per big idea,
  "pause and try it" moments, no hype.
- 7–10 minutes, 15–20 segments of 30–100 words, one visual per segment; 4 s brand bumper; chapter progress bar.
- Audio mastered to −16 LUFS; 1920×1080 at 30 fps, H.264 + AAC; captions (SRT/VTT), transcript, chapters, thumbnail.

## How a lesson is built (the pipeline)
```
lessons/<id>/script.json  ──► lab footage (lessons/<id>/clips.py → python lab/record.py)
        │                      narration   (voice/tts.py  or  voice/import_takes.py)
        └──► scene map (studio/src/lessons/<id>/index.tsx)  ──► python tools/render.py ──► out/<id>/
```
`lessons/CURRENT` names the active lesson; `python tools/use.py <id>` switches it (every tool reads it).
Timeline rule (`studio/src/Main.tsx` and `tools/common.py`): bumper, then each segment = narration + `tail`, end to end.

## File map
| Path | Role |
|---|---|
| `course/module-1.md` | the instructor's course plan (lesson aims, slides, demo commands, draft narration); `.docx` is the original |
| `lessons/<id>/script.json` | **source of truth**: lesson meta, thumbnail block, segments (`id`, `chapter`, `text`, `tail`) |
| `lessons/<id>/clips.py` | recording choreography: `CLIPS = {name: bash}` with `mark` events |
| `lab/setup.sh`, `lab/polish.sh` | build and style the Docker Ubuntu desktop (`linux-lab`) |
| `lab/record.py` | runs the clips in the lab, records with ffmpeg, writes `studio/src/data/<id>/clips.json` |
| `voice/tts.py` | Kokoro narration (`am_michael` @ 0.95) + word timings → `studio/src/data/<id>/timings.json` |
| `voice/textutil.py` | `TTS_SUBS`: how technical terms are pronounced (add new terms here before running TTS) |
| `voice/import_takes.py` | the instructor's takes → mastered audio + word timings (faster-whisper) |
| `studio/src/lessons/<id>/index.tsx` | the lesson's scene map (+ any bespoke scenes next to it) |
| `studio/src/scenes/` | reusable library: `Clip.tsx` (ClipScene, NoteCard), `Cards.tsx`, `Common.tsx` (HOLD, cell, Scrim) |
| `studio/src/kit.tsx`, `theme.ts` | Stage, Reveal, Eyebrow, Chip, Icon.*; colours, fonts, brand name |
| `tools/` | `new_lesson`, `use`, `render`, `review_frames`, `check`, `export_captions`, `export_script`, `frame_at`, `studio` |
| `out/<id>/` | renders, captions, transcript, chapters, thumbnail, review frames (not committed) |

## Commands (run from the repo root)
```
python tools/new_lesson.py 1.2 "Title" --next "1.3|Title"   scaffold + activate a lesson
python tools/use.py 1.2                                     switch the active lesson
python lab/record.py [clip ...] | --list                    record footage in the lab
voice/.venv/Scripts/python voice/tts.py [--only s03,s04]    narration (macOS/Linux: voice/.venv/bin/python)
python tools/studio.py tsc | still | frames | open          type-check, one frame, short range, interactive studio
python tools/render.py [--scale 0.5] [--redo 3,4] [--clean] draft / final render (chunked, resumable)
python tools/review_frames.py [video] [--every 15]          contact sheet + two frames per segment → out/<id>/review/
python tools/export_captions.py && python tools/export_script.py   SRT, VTT, transcript, chapters, read-aloud script
python tools/check.py [video]                               technical QA (format, loudness, duration, captions)
python tools/frame_at.py s12 "phrase"                       global frame where a phrase is spoken
```

## Lab facts and limits (say them honestly in narration when relevant)
- The lab is `lscr.io/linuxserver/webtop:ubuntu-xfce` (Ubuntu, XFCE, 1080p) with user `student`, host `linux-lab`.
  Rebuild only with `bash lab/setup.sh`; **never `docker start` the old container** (the renamed user breaks its boot).
- The kernel is the Docker host's (`...microsoft-standard-WSL2` on Windows). PID 1 is `s6-svscan`, not `systemd`.
  Boot/systemd/WSL-install topics (lessons 1.5, 1.6 parts, module 5) need a real VM or host-screen capture: **not built
  yet — stop and tell the instructor instead of faking it.**
- Docker-image folders (`/app`, `/config`, …) are hidden from Thunar via `/.hidden`; `ls /` in a terminal still shows them.
- System Monitor's graphs are empty on open: wait ~45 s before filming Resources. Its tab clicks need mouse motion first.
- Thunar draws a folder ~3 s after a double-click; GTK4 windows re-apply their size after mapping (`place` re-asserts).
- The recorder runs via `sudo` so ffmpeg never appears in the student's process list.

## Lessons learned on 1.1 (check every new lesson against these)
1. Footage must never show the *next* step early: end shared-clip scenes with `HOLD(nextMarker, lead)`.
2. Highlights must appear after the UI they point at is drawn (account for marker lag).
3. The chapter tag covers UI: it fades after 4.5 s; keep NoteCards away from the bottom-left (lower thirds) and the top-left.
4. Terminal: the whole command and its full output must be readable; zoom with `cams`, and check the right edge (COMMAND column).
5. Diagrams must not teach a misconception (the shell is a program in user space; the kernel does the four jobs).
6. Explain numbers the student sees (free vs available vs cache); name the column before highlighting it.
7. Pronunciation: every command/flag/acronym gets a `TTS_SUBS` entry before TTS; listen for "dash A" style misreads.
8. Thumbnail shows something the lesson actually shows; no WSL strings on the course page.
9. Renders: this class of machine (16 GB) OOM-kills full-concurrency renders; use `tools/render.py` (concurrency 3).
10. Review with frames, not memory: contact sheet + per-segment frames, then an independent reviewer, before the final.

## Cost and time expectations
A new lesson ≈ 2–3 hours of mostly unattended work and ≈ US$10–15 of API-equivalent usage (on a Claude plan it just
uses the plan's quota). Renders dominate wall time: start them in the background and keep working. Lesson 1.1 took
longer (~5 h, ~$27) because the pipeline itself was being built.
