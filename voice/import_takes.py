"""Swap in the instructor's real voice.

Put one recording per segment in a folder (s01.wav, s02.m4a, ... any format ffmpeg reads),
then run:   voice/.venv/Scripts/python voice/import_takes.py <folder>

For every take found: clean + master it (noise reduction, -16 LUFS), transcribe it with word
timestamps, align those words to the script text, and update studio/src/data/<lesson>/timings.json
for the ACTIVE lesson (lessons/CURRENT). Segments without a take keep their current audio.
Then re-render the video (python tools/render.py) and re-export captions.
"""
import glob
import json
import os
import sys

from asr import transcribe
from master import master
from textutil import align_display_to_audio, display_words, norm

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, "tools"))
from common import paths  # noqa: E402

P = paths()
SCRIPT = P.script
AUDIO_DIR = os.environ.get("LC_AUDIO_DIR", P.audio)
TIMINGS = os.environ.get("LC_TIMINGS", P.timings)


def duration(path: str) -> float:
    import subprocess
    out = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", path],
                         capture_output=True, text=True, check=True).stdout
    return float(out.strip())


def main():
    if len(sys.argv) < 2:
        print(__doc__)
        return 1
    folder = sys.argv[1]
    script = json.load(open(SCRIPT, encoding="utf-8"))
    timings = json.load(open(TIMINGS, encoding="utf-8"))
    found = 0
    for seg in script["segments"]:
        takes = glob.glob(os.path.join(folder, f"{seg['id']}.*"))
        if not takes:
            continue
        found += 1
        dst = os.path.join(AUDIO_DIR, f"{seg['id']}.wav")
        master(takes[0], dst, denoise=True)
        text, words = transcribe(dst, prompt=seg["text"])
        disp = display_words(seg["text"])
        spans = align_display_to_audio(disp, words)
        matched = sum(1 for w in disp if norm(w) in {norm(x["w"]) for x in words})
        timings[seg["id"]] = {
            "duration": round(duration(dst), 3),
            "source": f"take:{os.path.basename(takes[0])}",
            "words": [{"w": w, "start": round(s, 3), "end": round(e, 3)} for w, (s, e) in zip(disp, spans)],
        }
        score = matched / max(1, len(disp))
        flag = "" if score > 0.85 else "   <-- check this take: it differs from the script"
        print(f"{seg['id']}: {timings[seg['id']]['duration']:.1f}s, {score:.0%} of script words matched{flag}", flush=True)
    json.dump(timings, open(TIMINGS, "w", encoding="utf-8"), indent=1)
    print(f"{found} take(s) imported. Re-render with: cd studio && npm run render")
    return 0


if __name__ == "__main__":
    sys.exit(main())
