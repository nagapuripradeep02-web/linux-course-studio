"""Scripted, repeatable screen recordings of the real Ubuntu lab, for the ACTIVE lesson.

The clips themselves live in lessons/<lesson>/clips.py (a CLIPS dict of bash snippets). Each clip =
prep (not recorded) + timed actions (recorded with ffmpeg x11grab inside the container). Every action can
drop a named marker; marker times (seconds into the clip) are written to studio/src/data/<lesson>/clips.json
so the editor can sync footage to narration.

Usage:  python lab/record.py                 all clips of the active lesson
        python lab/record.py sysmon terminal  only these
        python lab/record.py --list           show clip names and their markers without recording
"""
import importlib.util
import json
import os
import re
import subprocess
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, "tools"))
from common import paths  # noqa: E402

C = "linux-lab"
ENV = {**os.environ, "MSYS_NO_PATHCONV": "1"}

HEADER = r'''#!/bin/bash
export DISPLAY=:1
PID=$(pgrep -u 1000 -x xfce4-session | head -1)
export $(tr '\0' '\n' < /proc/$PID/environ | grep ^DBUS_SESSION_BUS_ADDRESS=)
EV=/tmp/rec/$CLIP.events
: > $EV
mark() { echo "$1 $(date +%s.%N)" >> $EV; }
# smooth eased mouse glide: glide X Y SECONDS
glide() {
  eval $(xdotool getmouselocation --shell)
  local x0=$X y0=$Y x1=$1 y1=$2 d=${3:-0.6}
  local n=$(awk -v d=$d 'BEGIN{printf "%d", d*60}')
  for ((i=1;i<=n;i++)); do
    read px py < <(awk -v i=$i -v n=$n -v a=$x0 -v b=$y0 -v c=$x1 -v e=$y1 'BEGIN{t=i/n; k=(t<.5)?4*t*t*t:1-((-2*t+2)^3)/2; printf "%d %d", a+(c-a)*k, b+(e-b)*k}')
    xdotool mousemove $px $py
    sleep 0.0145
  done
}
# human-paced typing with small random jitter
typeh() {
  local s="$1"
  for ((i=0;i<${#s};i++)); do
    xdotool type --delay 0 -- "${s:$i:1}"
    sleep $(awk -v r=$RANDOM 'BEGIN{printf "%.3f", 0.06 + (r%70)/1000}')
  done
}
# move the first window whose title matches as soon as it appears
place() {
  for i in $(seq 1 600); do
    w=$(xdotool search --onlyvisible --name "$1" 2>/dev/null | head -1)
    if [ -n "$w" ]; then
      # GTK4 apps restore their saved size just after mapping, so re-assert a few times
      for d in 0 0.15 0.35 0.7; do sleep $d; wmctrl -i -r $w -e 0,$2,$3,$4,$5; done
      return
    fi
    sleep 0.01
  done
}
closeall() {
  pkill -x xfce4-terminal 2>/dev/null; pkill -x thunar 2>/dev/null; pkill -x thunar-real 2>/dev/null
  pkill -f "gnome-system-monitor$" 2>/dev/null; pkill -x gnome-system-mo 2>/dev/null
  # wait until the old windows are really gone, so place() can't grab a dying one
  for i in $(seq 1 50); do
    xdotool search --onlyvisible --name "System Monitor|Thunar|Terminal" >/dev/null 2>&1 || break
    sleep 0.1
  done
  sleep 1
}
# The recorder runs as root (via sudo) so it stays out of the student's own process list on screen.
start_rec() {
  sudo -n sh -c "ffmpeg -hide_banner -y -f x11grab -framerate 30 -video_size 1920x1080 -i :1 \
    -c:v libx264 -preset veryfast -crf 12 -pix_fmt yuv420p -g 30 /tmp/rec/$CLIP.mp4 2> /tmp/rec/$CLIP.ffmpeg.log" &
  sleep 1.2
}
stop_rec() { sleep ${1:-1}; sudo -n pkill -INT -x ffmpeg; sleep 1; while pgrep -x ffmpeg >/dev/null; do sleep 0.3; done; }
'''


def load_clips(P):
    if not os.path.exists(P.clips_py):
        sys.exit(f"{P.clips_py} not found: write the lesson's clips first (see lessons/1.1/clips.py).")
    spec = importlib.util.spec_from_file_location("lesson_clips", P.clips_py)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod.CLIPS


def sh(cmd, **kw):
    return subprocess.run(cmd, env=ENV, check=True, **kw)


def lab_ready():
    r = subprocess.run(["docker", "exec", C, "pgrep", "-u", "1000", "-x", "xfce4-session"], env=ENV, capture_output=True)
    if r.returncode != 0:
        sys.exit("The lab desktop is not running. Start it with:  bash lab/setup.sh")


def record(P, clips, name: str):
    body = f"CLIP={name}\n" + HEADER + clips[name]
    local = os.path.join(ROOT, "lab", f"_{name}.sh")
    with open(local, "w", newline="\n") as f:
        f.write(body)
    sh(["docker", "cp", local, f"{C}:/tmp/rec/{name}.sh"])
    print(f"recording {name} ...", flush=True)
    sh(["docker", "exec", "-u", "1000", C, "bash", f"/tmp/rec/{name}.sh"])
    log = subprocess.run(["docker", "exec", C, "cat", f"/tmp/rec/{name}.ffmpeg.log"], env=ENV,
                         capture_output=True, text=True).stdout
    start = float(re.search(r"start: ([0-9.]+)", log).group(1))
    evs = subprocess.run(["docker", "exec", C, "cat", f"/tmp/rec/{name}.events"], env=ENV,
                         capture_output=True, text=True).stdout.split("\n")
    events = {}
    for line in evs:
        if line.strip():
            k, v = line.split()
            events[k] = round(float(v) - start, 3)
    os.makedirs(P.clips, exist_ok=True)
    out = os.path.join(P.clips, f"{name}.mp4")
    sh(["docker", "cp", f"{C}:/tmp/rec/{name}.mp4", out])
    dur = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", out],
                               capture_output=True, text=True).stdout.strip())
    data = json.load(open(P.clips_json)) if os.path.exists(P.clips_json) else {}
    data[name] = {"duration": round(dur, 3), "events": events}
    os.makedirs(P.data, exist_ok=True)
    json.dump(data, open(P.clips_json, "w"), indent=1)
    print(f"  {name}: {dur:.1f}s  events={events}", flush=True)


if __name__ == "__main__":
    P = paths()
    clips = load_clips(P)
    args = sys.argv[1:]
    if args == ["--list"]:
        for n, body in clips.items():
            marks = re.findall(r"^mark (\S+)", body, flags=re.M)
            print(f"{n}: {' -> '.join(marks)}")
        sys.exit()
    names = args or list(clips)
    unknown = [n for n in names if n not in clips]
    if unknown:
        sys.exit(f"unknown clip(s) {unknown}; available: {list(clips)}")
    lab_ready()
    for n in names:
        record(P, clips, n)
