---
name: voice
description: Replace a lesson's AI placeholder narration with the instructor's own recorded takes (one audio file per segment) and rebuild the video, captions and transcript around their voice. Use when the instructor has recorded audio, mentions takes/recordings/"my voice", or asks to put their voice in a lesson.
argument-hint: <lesson number> <folder containing s01.wav, s02.wav, …>
---

# /voice — put the instructor's voice in

Everything in the video is timed from the words, so this is a rebuild, not an edit: import → re-render → re-export.

## 1. Collect
- Lesson id and folder from `$ARGUMENTS`; missing → ask for both in one question.
- `python tools/use.py <id>`; read `lessons/<id>/script.json` for the segment ids.
- List the folder. Accept any audio format ffmpeg reads (wav, m4a, mp3, flac, ogg). Map files to segment ids leniently:
  `s01.wav`, `S1.m4a`, `01.mp3`, `01 - welcome.wav` all mean `s01`. If the mapping is ambiguous or some segments are
  missing, show the mapping table and ask once. Copy/rename into a temp folder as `sNN.<ext>` before importing.
- Takes the instructor did not record keep the current (AI) audio: say so, it is fine for a partial check.

## 2. Import
```
voice/.venv/Scripts/python voice/import_takes.py <folder>        (macOS/Linux: voice/.venv/bin/python)
```
It cleans each take (noise reduction, −16 LUFS), transcribes it, aligns the words to the script and prints
`sNN: 41.2s, 97% of script words matched`. Read every line:
- ≥ 90 %: good.
- 85–90 %: fine, but note it.
- < 85 % (flagged `check this take`): the take differs from the script. Run
  `voice/.venv/Scripts/python voice/asr.py <that file>` and show the instructor the transcript next to the script text.
  Ask: re-record that segment, or update `script.json` to the words they actually said (then re-run `import_takes.py`
  for that folder so captions and anchors match)? If they changed words that `index.tsx` anchors to (`at(seg, "...")`),
  update those phrases too; `python tools/studio.py tsc` won't catch it, the render will.

## 3. Rebuild
```
python tools/render.py --clean                  (durations changed, so everything re-renders; background it)
python tools/export_captions.py && python tools/export_script.py
python tools/check.py
python tools/review_frames.py --every 30
```
Read the sheet and three segment frames where highlights appear (a terminal segment, a card, a diagram): the highlight
must appear with the spoken word, not before. If a highlight is early or late by more than ~0.3 s across the board,
the take has a long silence at the start; trim with `ffmpeg -af silenceremove=start_periods=1:start_threshold=-45dB`
and re-import.

## 4. Deliver
Files in `out/<id>/` (MP4, SRT, VTT, transcript, chapters), the match scores, and anything they should re-record.
Remind them: future lessons can start with their voice directly (choose "import my takes" in `/lesson`).
