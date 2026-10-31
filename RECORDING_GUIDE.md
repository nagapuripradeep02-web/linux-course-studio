# Recording your voice for a lesson

A finished lesson starts with a placeholder AI voice. You don't need a camera or a screen recording: **just read the
script, one short file per section**, and the video rebuilds itself around your voice. Every animation and highlight is
tied to the words, so it adapts to your pace automatically.

## What you need
- A quiet room with soft things around (curtains, a bed, a sofa). Avoid empty rooms with bare walls.
- Any decent mic: a USB mic is ideal, but a modern phone held 15–20 cm from your mouth also works well.
- A free recorder: Audacity (PC/Mac) or the phone's built-in voice recorder.

## How to record
1. Open `out/<lesson>/script-to-read.md` (the same words that appear in the video and the subtitles).
2. Record **one file per section**, named exactly after the section: `s01.wav`, `s02.wav` … (`.m4a` or `.mp3` from a
   phone is fine too). The number of sections is in the script file.
3. Leave **one second of silence** at the start and end of each file.
4. Read in a calm, friendly "explaining to a student" tone, slightly slower than normal conversation.
5. If you stumble, stop, pause two seconds and re-read the **whole sentence**. It's even simpler to re-record that file.
6. Small wording changes are fine (the tool warns if a take is very different from the script). For bigger changes,
   tell Claude to change the script first, so the subtitles match what you say.

## Saying the commands
Say commands the way an instructor says them out loud. Examples from Lesson 1.1:

| On screen | Say it like |
|---|---|
| `uname -a` | "you-name dash A" |
| `uname -r` | "you-name dash R" |
| `echo $SHELL` | "echo dollar shell" |
| `ps aux \| head -5` | "P S A U X, piped into head, dash five" (the script phrases it naturally) |
| `free -h` | "free dash H" |
| `/etc` | "slash E T C" |
| `x86_64` | "x86 64" |
| `GNU/Linux` | "G-new slash Linux" |

Each lesson's `script-to-read.md` is written so the commands read naturally; if you are unsure how to say something,
ask Claude.

## Mic tips
- Keep the same distance and the same room for every file, so all sections sound the same.
- Turn off fans and AC, and silence your phone.
- Record a 10-second test, listen on headphones, then record the rest.

## Putting it in the video
Put all files in one folder (for example `takes/1.2/`) and type in Claude Code:

```
/voice 1.2 C:\path\to\takes\1.2
```

Claude cleans the audio (noise reduction, levels set to −16 LUFS), syncs every highlight to your words, rebuilds the
subtitles and renders the video again. It tells you if any section should be re-recorded.
