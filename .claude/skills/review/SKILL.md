---
name: review
description: Independent quality review of a rendered Linux Foundations lesson video — as a paying beginner and as a senior Linux instructor would see it — covering visual bugs, timing, readability, factual accuracy and clarity. Use when asked to review, check, QA, critique or "watch" a lesson render, and as the review step inside /lesson.
argument-hint: [lesson number] [path to .mp4]
---

# /review — look at the video the way a customer will

Inputs: lesson id (default `lessons/CURRENT`) and a video (default: newest `.mp4` in `out/<id>/`). Output: a findings
table and a verdict. **Do not edit files** unless `/lesson` invoked you or the instructor asks for fixes.

## 1. Frames
```
python tools/use.py <id>
python tools/review_frames.py <video> --every 10
```
Read `out/<id>/review/sheet.png` (and `sheet.txt` for the tile → time map), then **every** `seg-<id>-a.png` and
`seg-<id>-b.png`. For anything suspicious, grab the exact moment:
`python tools/frame_at.py <seg> "<phrase>"` → `python tools/studio.py still Lesson <frame> out/<id>/review/x.png`, or
`ffmpeg -ss <sec> -i <video> -frames:v 1 out/<id>/review/t<sec>.png`.

## 2. Mechanical checklist (you, from the frames)
- Footage shows the **next** action before the narration gets there (missing `HOLD`), or runs out and freezes oddly.
- A highlight box or label misses its target, appears before the UI is drawn, or covers what it points at.
- Text cut off at an edge (terminal COMMAND column, long paths), text too small to read on a phone, overlapping elements.
- Chapter tag / lower third / NoteCard covering UI the narration refers to.
- Wrong window, wrong tab, empty graphs, the recorder or other tooling visible, debris on the desktop.
- Cards: headings overlapping, chips clipped, inconsistent spacing with Lesson 1.1.
- Captions: the `.srt` next to the video exists; spot-check 3 cues against the audio moment (read the transcript and a
  frame at that time: the highlighted word should match what the cue says).
- Thumbnail: shows something the lesson shows; no host-specific strings (WSL2) on the course page.

## 3. Content review (one subagent, persona brief)
Spawn **one** general-purpose Agent with: the transcript (`out/<id>/Lesson-<id>-transcript.md`, or the segment texts
from `lessons/<id>/script.json`), the review folder path, the lesson's section of `course/module-1.md`, and this brief:

> You are two people: (a) a paying beginner who just bought this Linux course and knows nothing yet; (b) a senior Linux
> instructor with 30 years of teaching. Read the transcript and look at every PNG in the review folder. Report, as a
> numbered list with the segment id or time: anything factually wrong or misleading; any step the beginner cannot
> follow (jargon used before it is defined, a number on screen that is never explained, a command whose purpose is
> unclear); anything that feels like a YouTube explainer rather than a course (hype, filler, jokes that waste time);
> pacing problems (too fast to read, too slow); and visual problems you notice. For each item: severity (blocker /
> should-fix / polish), what you saw, and the fix you'd make. Be specific and skeptical; do not praise.

## 4. Merge and verify
Combine your findings and the subagent's. **Verify each one against a frame or the script** before keeping it; drop
anything you cannot confirm. Classify:
- **blocker**: wrong or misleading content, unreadable or broken visuals, footage out of sync;
- **should-fix**: anything a paying customer would notice and dislike;
- **polish**: nice-to-have.
For each, name where the fix lives: `script.json` (+ `tts.py --only`), `clips.py` (+ re-record), `index.tsx` (timing /
rects), `voice/textutil.py` (pronunciation), or the scene library.

## 5. Report
A table: `# · time/segment · severity · what · where to fix · suggested fix`, then a verdict: **SHIP** (no blockers,
≤ 2 should-fix) or **FIX FIRST** (list the items). Under 25 lines plus the table. If `/lesson` invoked you, hand back the
table; `/lesson` applies the fixes.
