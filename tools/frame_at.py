"""Print the global frame where a phrase is spoken: python tools/frame_at.py s11 "kernel version," [offset_seconds]"""
import re
import sys

from common import load_json, paths

P = paths()
script = load_json(P.script)
tim = load_json(P.timings)
seg, phrase = sys.argv[1], sys.argv[2]
off = float(sys.argv[3]) if len(sys.argv) > 3 else 0.0
n = lambda w: re.sub(r"\.+$", "", re.sub(r"[^a-z0-9$\-./]", "", w.lower()))
f = round(script["lesson"]["bumperSeconds"] * 30)
for s in script["segments"]:
    if s["id"] == seg:
        words, target = tim[seg]["words"], [n(x) for x in phrase.split()]
        for i in range(len(words)):
            if [n(w["w"]) for w in words[i:i + len(target)]] == target:
                print(f + round((words[i]["start"] + off) * 30)); sys.exit()
        sys.exit(f"not found: {phrase}")
    f += round((tim[s["id"]]["duration"] + s["tail"]) * 30)
