"""Scaffold a new lesson and make it active:

  python tools/new_lesson.py 1.2 "How Linux came into existence" --next "1.3|Linux distributions"

Creates lessons/<id>/script.json (a skeleton to rewrite as the real narration), lessons/<id>/clips.py
(the lab recording choreography, with a worked example), then runs tools/use.py for the studio side.
Module number/title are copied from the lesson listed in lessons/CURRENT unless given with --module.
"""
import argparse
import json
import os
import sys

from common import ROOT, load_json
from use import use

CLIPS_TEMPLATE = '''"""Lab recording choreography for Lesson {lid}: what the student sees happen on the real Ubuntu desktop.

Each clip is a bash snippet run inside the lab (see lab/record.py for the helpers): prep is NOT recorded,
`start_rec` begins the recording, `mark <name>` drops a named marker the editor syncs narration to,
`stop_rec` ends it. Record with:   python lab/record.py            (or: python lab/record.py terminal)

Helpers: glide X Y SECONDS (eased mouse move) · typeh "text" (human typing) · place "Title" X Y W H (window
placement, run in background with &) · closeall · xdotool key Return / ctrl+l / alt+Up · wmctrl.
Screen is 1920x1080. Keep every clip a little LONGER than its narration: footage can hold, but never run out.
"""

# window rectangles used by the clips below (x y w h)
SYSMON_RECT = "160 70 1600 960"

CLIPS = {{
    # Example: open a terminal, maximise it, run two commands. Rename/replace for this lesson.
    "terminal": r\'\'\'
closeall
xdotool mousemove 1100 600
start_rec
mark start
sleep 1.2
mark open_term
glide 60 13 1.0; xdotool click 1; sleep 0.5
glide 96 77 0.45; sleep 0.15
place "Terminal" 260 160 1400 760 &
xdotool click 1
sleep 1.4
w=$(xdotool search --onlyvisible --name "Terminal" | head -1)
sleep 0.4
wmctrl -i -r $w -b add,maximized_vert,maximized_horz
sleep 0.6
glide 1880 1050 0.8
sleep 1.0
mark type_first
typeh "cat /etc/os-release"; sleep 0.35
mark enter_first
xdotool key Return; sleep 2.5
mark type_second
typeh "hostnamectl"; sleep 0.35
mark enter_second
xdotool key Return; sleep 3.0
mark end
stop_rec 1
\'\'\',
}}
'''


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("id", help="lesson number, e.g. 1.2")
    ap.add_argument("title")
    ap.add_argument("--next", default="", help='"<number>|<title>" of the following lesson')
    ap.add_argument("--module", default="", help='"<number>|<title>" (default: same module as the current lesson)')
    a = ap.parse_args()

    ldir = os.path.join(ROOT, "lessons", a.id)
    if os.path.exists(os.path.join(ldir, "script.json")):
        sys.exit(f"lessons/{a.id}/script.json already exists; use `python tools/use.py {a.id}` to switch to it.")

    if a.module:
        mnum, mtitle = a.module.split("|", 1)
        module = {"module": int(mnum), "moduleTitle": mtitle.strip()}
    else:
        cur = open(os.path.join(ROOT, "lessons", "CURRENT"), encoding="utf-8").read().strip()
        prev = load_json(os.path.join(ROOT, "lessons", cur, "script.json"))["lesson"]
        module = {"module": prev["module"], "moduleTitle": prev["moduleTitle"]}
    nxt = {"number": "", "title": ""}
    if a.next:
        n, t = a.next.split("|", 1)
        nxt = {"number": n.strip(), "title": t.strip()}

    script = {
        "lesson": {
            **module,
            "number": a.id,
            "title": a.title,
            "next": nxt,
            "bumperSeconds": 4,
            "thumbnail": {"chips": [], "prompt": "", "output": ""},
        },
        "segments": [
            {"id": "s01", "chapter": "Welcome", "tail": 0.8,
             "text": f"Welcome back. In this lesson, {a.title.rstrip('?.')}. REPLACE THIS with the real narration."},
            {"id": "s02", "chapter": "Main idea", "tail": 0.6,
             "text": "REPLACE THIS. One segment = one visual. Keep each segment 30 to 100 words."},
            {"id": "s03", "chapter": "Recap", "tail": 2.5,
             "text": "REPLACE THIS. In the next lesson, we will ... See you there."},
        ],
    }
    os.makedirs(ldir, exist_ok=True)
    json.dump(script, open(os.path.join(ldir, "script.json"), "w", encoding="utf-8"), indent=1, ensure_ascii=False)
    open(os.path.join(ldir, "clips.py"), "w", encoding="utf-8", newline="\n").write(CLIPS_TEMPLATE.format(lid=a.id))
    print(f"created lessons/{a.id}/script.json and clips.py")
    use(a.id)


if __name__ == "__main__":
    main()
