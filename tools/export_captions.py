"""Build subtitles (SRT + WebVTT), the website transcript, and chapter markers from the final timings.

Timeline rule (mirrors studio/src/Main.tsx): bumper, then each segment = narration + tail, end to end.
Usage: python tools/export_captions.py <out_dir>
"""
import json
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FPS = 30
MAX_LINE = 42
MAX_CUE_CHARS = 84
MAX_CUE_SECONDS = 6.5


def ts(sec: float, sep=",") -> str:
    ms = int(round(sec * 1000))
    h, ms = divmod(ms, 3600000)
    m, ms = divmod(ms, 60000)
    s, ms = divmod(ms, 1000)
    return f"{h:02}:{m:02}:{s:02}{sep}{ms:03}"


def wrap(text: str) -> str:
    if len(text) <= MAX_LINE:
        return text
    words, best = text.split(), None
    for i in range(1, len(words)):
        a, b = " ".join(words[:i]), " ".join(words[i:])
        score = max(len(a), len(b))
        if best is None or score < best[0]:
            best = (score, a + "\n" + b)
    return best[1]


def cues_for(words, offset):
    cues, cur = [], []
    for i, w in enumerate(words):
        cur.append(w)
        text = " ".join(x["w"] for x in cur)
        nxt = words[i + 1] if i + 1 < len(words) else None
        sentence_end = w["w"].endswith((".", "?", "!"))
        too_long = nxt is not None and len(text) + 1 + len(nxt["w"]) > MAX_CUE_CHARS
        too_slow = cur[-1]["end"] - cur[0]["start"] > MAX_CUE_SECONDS
        soft = w["w"].endswith((",", ":", ";")) and len(text) > 50
        if nxt is None or sentence_end or too_long or too_slow or soft:
            cues.append((offset + cur[0]["start"], offset + cur[-1]["end"] + 0.25, wrap(text)))
            cur = []
    # never overlap the next cue
    out = []
    for i, (a, b, t) in enumerate(cues):
        if i + 1 < len(cues):
            b = min(b, cues[i + 1][0] - 0.04)
        out.append((a, b, t))
    return out


def main():
    from common import load_json, paths

    P = paths()
    out_dir = sys.argv[1] if len(sys.argv) > 1 else P.out
    os.makedirs(out_dir, exist_ok=True)
    script = load_json(P.script)
    timings = load_json(P.timings)
    les = script["lesson"]

    frame = round(les["bumperSeconds"] * FPS)
    cues, chapters, transcript = [], [], []
    last_chapter = None
    for seg in script["segments"]:
        t = timings[seg["id"]]
        start = frame / FPS
        cues += cues_for(t["words"], start)
        if seg["chapter"] != last_chapter:
            chapters.append((start, seg["chapter"]))
            transcript.append(f"\n## {seg['chapter']}\n")
            last_chapter = seg["chapter"]
        transcript.append(seg["text"] + "\n")
        frame += round((t["duration"] + seg["tail"]) * FPS)

    base = f"Lesson-{les['number']}"
    with open(os.path.join(out_dir, f"{base}.srt"), "w", encoding="utf-8") as f:
        for i, (a, b, text) in enumerate(cues, 1):
            f.write(f"{i}\n{ts(a)} --> {ts(b)}\n{text}\n\n")
    with open(os.path.join(out_dir, f"{base}.vtt"), "w", encoding="utf-8") as f:
        f.write("WEBVTT\n\n")
        for a, b, text in cues:
            f.write(f"{ts(a, '.')} --> {ts(b, '.')}\n{text}\n\n")
    with open(os.path.join(out_dir, f"{base}-transcript.md"), "w", encoding="utf-8") as f:
        f.write(f"# Lesson {les['number']}: {les['title']}\n\n")
        f.write(f"*Module {les['module']}: {les['moduleTitle']}*\n")
        f.write("".join(transcript))
    with open(os.path.join(out_dir, f"{base}-chapters.txt"), "w", encoding="utf-8") as f:
        for a, name in chapters:
            m, s = divmod(int(a), 60)
            f.write(f"{m:02}:{s:02} {name}\n")
    print(f"{len(cues)} cues, {len(chapters)} chapters, runtime {frame / FPS / 60:.2f} min -> {out_dir}")


if __name__ == "__main__":
    main()
