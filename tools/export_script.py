"""Write the read-aloud script for the instructor: one numbered section per recording file.
Usage: python tools/export_script.py [out_dir]   (default out/<lesson>)"""
import os
import sys

from common import load_json, paths

P = paths()
out_dir = sys.argv[1] if len(sys.argv) > 1 else P.out
os.makedirs(out_dir, exist_ok=True)
d = load_json(P.script)
les = d["lesson"]
lines = [f"# Lesson {les['number']}: {les['title']} - script to read\n",
         "Record each section below as its own file, named after the section (e.g. `s01.wav`).\n"]
for s in d["segments"]:
    lines.append(f"\n## {s['id']}  ({s['chapter']})\n\n{s['text']}\n")
open(os.path.join(out_dir, "script-to-read.md"), "w", encoding="utf-8").write("".join(lines))
print("script-to-read.md written to", out_dir)
