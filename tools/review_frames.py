"""Frames for visual review of a render, so the whole video can be checked without watching it in real time.

  python tools/review_frames.py                 # newest render in out/<lesson>/ (draft or final)
  python tools/review_frames.py out/1.2/x.mp4 --every 20

Writes out/<lesson>/review/:
  sheet.png          contact sheet, one tile every --every seconds (default 15), 6 per row; sheet.txt maps tiles to times
  seg-<id>-a.png     each segment ~1.5 s after it starts (after the crossfade)
  seg-<id>-b.png     each segment at its midpoint
Open the PNGs with the Read tool and look for: clipped text, highlight boxes off their target, footage that
ran out or shows the NEXT action early, labels covering UI, wrong tab/window, subtitles vs audio.
"""
import argparse
import glob
import os
import shutil
import subprocess
import sys

from common import FPS, paths, segment_starts


def ffmpeg(*args):
    subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", *args], check=True)


def duration(video: str) -> float:
    out = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", video],
                         capture_output=True, text=True, check=True).stdout
    return float(out.strip())


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("video", nargs="?")
    ap.add_argument("--every", type=float, default=15)
    a = ap.parse_args()
    P = paths()
    video = a.video
    if not video:
        cands = sorted(glob.glob(os.path.join(P.out, "*.mp4")), key=os.path.getmtime)
        if not cands:
            sys.exit(f"no render in {P.out}; run tools/render.py first")
        video = cands[-1]
    rdir = os.path.join(P.out, "review")
    shutil.rmtree(rdir, ignore_errors=True)
    os.makedirs(rdir)

    dur = duration(video)
    n = int(dur // a.every) + 1
    cols, rows = 6, (n + 5) // 6
    ffmpeg("-i", video, "-vf", f"fps=1/{a.every},scale=320:-1,tile={cols}x{rows}", "-frames:v", "1",
           os.path.join(rdir, "sheet.png"))
    with open(os.path.join(rdir, "sheet.txt"), "w") as f:
        for i in range(n):
            t = i * a.every
            f.write(f"tile {i + 1:3d} (row {i // cols + 1}, col {i % cols + 1}): {int(t // 60):02d}:{int(t % 60):02d}\n")

    starts, _ = segment_starts(P)
    for i, (sid, t0) in enumerate(starts):
        t1 = starts[i + 1][1] if i + 1 < len(starts) else dur
        for tag, t in (("a", t0 + 1.5), ("b", (t0 + t1) / 2)):
            if t < dur:
                ffmpeg("-ss", f"{t:.3f}", "-i", video, "-frames:v", "1", "-vf", "scale=960:-1",
                       os.path.join(rdir, f"seg-{sid}-{tag}.png"))
    print(f"{os.path.basename(video)}: {dur:.1f}s -> {rdir}  (sheet.png + {2 * len(starts)} segment frames)")


if __name__ == "__main__":
    main()
