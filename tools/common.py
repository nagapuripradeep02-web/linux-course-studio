"""Shared paths for the ACTIVE lesson.

The active lesson is the id in lessons/CURRENT (set with `python tools/use.py 1.2`);
the LESSON environment variable overrides it for one command.
"""
import json
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
STUDIO = os.path.join(ROOT, "studio")
FPS = 30


def lesson_id(arg: str | None = None) -> str:
    lid = arg or os.environ.get("LESSON")
    if not lid:
        cur = os.path.join(ROOT, "lessons", "CURRENT")
        if not os.path.exists(cur):
            sys.exit("No active lesson. Run: python tools/use.py <lesson>   (e.g. 1.2)")
        lid = open(cur, encoding="utf-8").read().strip()
    if not os.path.isdir(os.path.join(ROOT, "lessons", lid)):
        sys.exit(f'lessons/{lid} does not exist. Create it with: python tools/new_lesson.py {lid} "<title>"')
    return lid


class Paths:
    """Every per-lesson location, so no tool hard-codes a lesson number."""

    def __init__(self, lid: str):
        self.id = lid
        self.name = f"Lesson-{lid}"
        self.lesson_dir = os.path.join(ROOT, "lessons", lid)
        self.script = os.path.join(self.lesson_dir, "script.json")      # narration + chapters + tails
        self.clips_py = os.path.join(self.lesson_dir, "clips.py")       # lab recording choreography
        self.scenes = os.path.join(STUDIO, "src", "lessons", lid)        # index.tsx scene map + bespoke scenes
        self.data = os.path.join(STUDIO, "src", "data", lid)
        self.timings = os.path.join(self.data, "timings.json")           # word timings per segment
        self.clips_json = os.path.join(self.data, "clips.json")          # clip durations + marker times
        self.public = os.path.join(STUDIO, "public", lid)
        self.audio = os.path.join(self.public, "audio")                  # mastered narration, sNN.wav
        self.clips = os.path.join(self.public, "clips")                  # recorded footage, <clip>.mp4
        self.out = os.path.join(ROOT, "out", lid)                        # renders, captions, review frames
        self.raw_audio = os.path.join(ROOT, "voice", "out", lid, "raw")


def paths(arg: str | None = None) -> Paths:
    return Paths(lesson_id(arg))


def load_json(path: str):
    return json.load(open(path, encoding="utf-8"))


def segment_starts(P: Paths):
    """[(segment id, start seconds)] following the timeline rule: bumper, then narration + tail per segment."""
    script, tim = load_json(P.script), load_json(P.timings)
    t = script["lesson"]["bumperSeconds"]
    out = []
    for s in script["segments"]:
        out.append((s["id"], t))
        t += tim.get(s["id"], {}).get("duration", 3.0) + s["tail"]
    return out, t
