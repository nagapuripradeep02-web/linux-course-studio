---
name: lesson
description: Produce one complete Linux Foundations lesson video at the quality of Lesson 1.1 — narration script, real Ubuntu lab footage, AI or instructor voice, motion design, independent review, final MP4 + captions + thumbnail. Use whenever the instructor asks to make, create, build, produce, continue, redo or fix a lesson or lesson video, however briefly ("do 1.2", "next lesson", "make the distributions video", "fix the terminal part of 1.3").
argument-hint: <lesson number, e.g. 1.2> [anything the instructor wants]
---

# /lesson — produce a lesson video

You are the producer. The instructor's prompt is short ("$ARGUMENTS"); you supply the craft. Work through the steps in
order, report at the three checkpoints marked ★, and otherwise keep going without asking. Read `CLAUDE.md` first if you
have not in this session: it holds the quality bar, the lab limits and the lessons learned.

## 0. Orient (no questions yet)
1. Lesson id from `$ARGUMENTS` (e.g. `1.2`). None given → list the lessons in `course/module-1.md` without a
   `lessons/<id>/` folder and ask which one (one question).
2. Read the lesson's section of `course/module-1.md`: *At a glance*, *Slides and graphics*, *Demo commands*,
   *Narration script*. Also skim the module quiz, hands-on lab and scenarios for context the lesson should set up.
3. Read the reference: `lessons/1.1/script.json`, `lessons/1.1/clips.py`, `studio/src/lessons/1.1/index.tsx`, and
   `studio/src/scenes/Cards.tsx` + `Clip.tsx` + `Common.tsx` (what the library offers).
4. State check: if `lessons/<id>/` exists this is a continuation or a fix. Find where it stopped
   (`script.json` → `studio/src/data/<id>/clips.json` → `timings.json` → `index.tsx` → `out/<id>/*.mp4`) and resume
   there; for a fix request, go straight to step 7 with the instructor's complaint as the finding.
5. Tools: `docker exec linux-lab pgrep -x xfce4-session` must print a PID (else `bash lab/setup.sh`); `studio/node_modules`
   and `voice/.venv` must exist (else run `/setup`).
6. Lab limits (CLAUDE.md): if this lesson's demos need boot, systemd, installing WSL, or anything the Docker lab cannot
   show truthfully, say so now and agree an alternative with the instructor (e.g. show the concept on a diagram and the
   command on the lab where it *does* work) rather than faking footage.

## 1. Interview — at most three questions (AskUserQuestion), each with a recommended default
- **Voice**: "AI placeholder now, swap your voice later with /voice (Recommended)" vs "Import my takes now (folder)".
- **Demos**: "The plan's demo commands: <list them> (Recommended)" vs "Different demos (tell me)".
- **Wishes**: "Anything this lesson must include or avoid?" (free text, default: nothing).
Skip any question the instructor's notes already answer. Never ask about things the doctrine fixes (format, branding,
style, length band, structure).

## 2. Script — ★ the one approval you wait for
Scaffold, then write the real narration:
```
python tools/new_lesson.py <id> "<title>" --next "<next id>|<next title>"
```
Then rewrite `lessons/<id>/script.json` fully (the skeleton is a placeholder). Rules:
- Structure: **Welcome + objectives** (card) → **concept beats** (diagram/cards/desktop footage) → **hands-on terminal**
  (the plan's demo commands, one or two per segment, in a continuous terminal clip) → **Your turn** → **Recap** → **Next
  lesson**. 15–20 segments, 30–100 words each, 1,100–1,500 words in all (≈ 7–10 min at Kokoro's pace).
- Facts stay as in the plan; delivery changes: short sentences, one everyday analogy per big idea, say what the
  student will *see* ("look at the third line"), one "pause and try it" prompt. Culture-neutral plain English.
- One segment = one visual. `chapter` groups segments into the progress bar (4–7 chapters). `tail` (seconds of visual
  after the narration): 0.3 between continuous terminal segments, 0.6–1.0 after cards, 1.6 for Your turn, 2.5 at the end.
- Plan your anchors while writing: the words you will later time visuals to (a column name, "look at the top line",
  "this box lights up") must appear verbatim, once, in the segment text.
- Honesty: never promise an output the lab will not print. The kernel string and PID 1 are what they are.
- Pronunciation: add every new command, flag, path or acronym to `TTS_SUBS` in `voice/textutil.py` (regex → spoken
  form, e.g. `(r"\bvmlinuz\b", "vee-em-linuz")`) before TTS. Keep display text natural; the subtitles show the display text.
- `lesson.thumbnail`: 2–3 chips (colors: accent, teal, blue, violet, green) and one real command/output pair the lesson shows.
Then `python tools/use.py <id>` and `python tools/export_script.py`.
**★ Show the instructor** a table (id · chapter · words · opening words) and point to `out/<id>/script-to-read.md`.
Ask: "Approve, or tell me what to change?" Wait. Changing words is free now and costs a re-record later.

## 3. Demo design → `lessons/<id>/clips.py`
Decide which segments get footage and what the student should see happen. Write `CLIPS` as in `lessons/1.1/clips.py`:
- Prep before `start_rec` (open apps, warm System Monitor 45 s, position windows with `place "Title" X Y W H &`).
- After `start_rec`: `mark start`, then deliberate, slow actions: `glide` the mouse (0.8–1.6 s), `typeh` commands,
  `mark type_<cmd>` before typing, `mark enter_<cmd>` before Return, `sleep 2–3` after output, `mark end`, `stop_rec 1`.
- Make every clip **longer than the narration it will carry** (footage can hold; it cannot run out). One continuous
  terminal clip per terminal chapter, maximised (`wmctrl ... maximized_vert,maximized_horz`) so `cell()` coordinates hold.
- Keep outputs on screen readable: `clear` (`ctrl+l`, with `mark clear`) between groups of commands so output doesn't scroll.
- Never type anything destructive in the lab; `sudo` is passwordless there, so be careful with what you demonstrate.
`python lab/record.py --list` shows the markers; `python lab/record.py` records all clips (~1 min per clip).
Then **look at the footage**: `ffmpeg -ss <t> -i studio/public/<id>/clips/<clip>.mp4 -frames:v 1 out/<id>/review/<clip>-<t>.png`
at the marker times from `studio/src/data/<id>/clips.json`, and read the PNGs. Re-record a clip if a window landed wrong,
text is cut off, or a click missed. Note the exact pixel positions you will highlight.

## 4. Narration
`voice/.venv/Scripts/python voice/tts.py` (Windows; macOS/Linux `voice/.venv/bin/python`). ~5 s per segment.
If the instructor chose their own takes, run `/voice <id> <folder>` logic (import_takes) instead. Listen-check by
reading the printed durations: a segment far off `words / 2.3` seconds means a TTS stumble — fix text or TTS_SUBS and
re-run `--only sNN`.

## 5. Scene map → `studio/src/lessons/<id>/index.tsx`
Replace the scaffolded StubScenes one by one, following `lessons/1.1/index.tsx`:
- Cards: `TitleObjectives` (s01), `TileGrid` (lists of 2–6 things), `TryIt`, `Recap`, `NextUp`. Bespoke diagrams: copy
  the pattern of `lessons/1.1/Layers.tsx` (Stage + Reveal + `at()`), file next to index.tsx. Icons: `Icon.cpu memory disk
  network browser editor terminal process folder plug laptop phone server cloud router tv user pause check`.
- Footage: `<ClipScene clip beats cams highlights lowerThirds>` with children `NoteCard`/`Scrim`/custom badges.
  - `beats`: `{ at: <segment second>, event: <marker>, lead, rate }` — footage plays from `marker − lead`, then holds at
    the next beat. **End every scene that shares its clip with the next segment with `HOLD("<next marker>", lead)`**
    (lesson learned #1). Use `cut: true` on the following segment so continuous footage doesn't crossfade.
  - `cams`: `{ at, rect: [x, y, w, h], dur }` zooms (0.8–1.3 s); `rect: null` = full frame. Zoom into terminal output.
  - `highlights`: `{ from, to, rect, label, side, color }`; `to: 99` = until segment end. Terminal rects:
    `cell(row, col, len, rows)` where row 0 is the first prompt line after `clear`/open and columns count characters.
  - `lowerThirds`: `{ from, to, cmd, meaning }`, one per command, while it is typed and explained.
- `at(seg, "phrase")`: words are matched after lowercasing and stripping everything except `a-z 0-9 $ - . /` (trailing
  dots dropped), so `"kernel release,"` matches, and `"I'll"` becomes `ill`. Use 2–4 consecutive words; `{ nth: 2 }` for
  a repeat. A missing phrase throws at render time, not at `tsc` — the smoke render in step 6 catches it.
- Marker lag: terminal output appears ~0.1 s after `enter_*`; Thunar folder contents ~3 s after the double-click;
  show highlights only after the thing is drawn (lesson learned #2). Keep NoteCards off the bottom-left and top-left.
Then `python tools/studio.py tsc` and a smoke render of one footage segment:
`python tools/frame_at.py s11 "<phrase>"` → `python tools/studio.py still Lesson <frame> out/<id>/review/s11.png` → read it.

## 6. Draft render and visual pass (loop until clean)
```
python tools/render.py --scale 0.5          (≈ 6–10 min; run in the background and keep working)
python tools/review_frames.py               → out/<id>/review/sheet.png + seg-*.png
```
Read `sheet.png` and **every** `seg-*-a.png` / `seg-*-b.png`. Check against CLAUDE.md "Lessons learned" 1–8. For a
suspicious moment, grab the exact frame (`frame_at.py` + `studio.py still`, frames are 1920×1080 → use measured pixels
directly; review frames are 960 wide → ×2). Fix in `index.tsx` (timing/rects), `script.json` (+ re-run `tts.py --only`),
or `clips.py` (+ re-record). Re-render only what changed: `python tools/render.py --scale 0.5 --redo <chunk>` where
chunk = frame ÷ 1500; after a narration change durations shift, so run without `--redo` (stale chunks re-render).

## 7. ★ Independent review, then fixes
Run the `/review <id>` skill (Skill tool). Fix every *blocker* and *should-fix*; use judgement on *polish*. Re-render the
affected chunks and re-check those frames. Tell the instructor in 5–8 lines what the review found and what you changed.

## 8. Final
```
python tools/render.py --clean                 (full size; ≈ 25–35 min on a 16 GB laptop; background)
python tools/export_captions.py && python tools/export_script.py
python tools/studio.py still Thumbnail out/<id>/thumbnail.png
python tools/check.py                          (all PASS; WARN on duration ±0.5 s or loudness ±1 LUFS is acceptable)
ffmpeg -y -i out/<id>/Lesson-<id>.mp4 -vf scale=1280:-2 -c:v libx264 -crf 24 -preset slow -c:a copy "out/<id>/Lesson-<id> (mobile 720p).mp4"
```
Run `python tools/review_frames.py --every 30` once more on the final and read the sheet: the last check is of the file
that ships. Also read the thumbnail PNG.

## 9. ★ Deliver
Report plainly, under 20 lines: duration; the files in `out/<id>/` (MP4, 720p MP4, SRT, VTT, transcript, chapters,
thumbnail, script-to-read); what the student sees in each chapter (one line each); **known limitations, honestly**
(lab kernel string, anything simplified); what the instructor should do next (watch it on a phone and a laptop; record
their voice with `RECORDING_GUIDE.md`, then `/voice <id> <folder>`). Offer to adjust anything.

## Rules of thumb
- Don't invent facts beyond the plan; when the plan is wrong or outdated, say so and propose the correction in the script
  table rather than silently changing it.
- Prefer re-timing in `index.tsx` over re-recording; prefer re-recording over faking.
- Commit nothing and push nothing unless the instructor asks; the repo is theirs.
- When stuck for more than ~20 minutes on one problem, stop and explain the problem and your two best options.
