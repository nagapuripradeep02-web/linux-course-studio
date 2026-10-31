"""Memory-friendly final render: video in chunks (resumable), audio separately, then a lossless join.

Usage:
  python tools/render.py                 # render missing chunks, then assemble out/<lesson>/Lesson-<lesson>.mp4
  python tools/render.py --scale 0.5     # quick draft at half size (out/<lesson>/Lesson-<lesson>_s0.5.mp4)
  python tools/render.py --redo 3,4      # re-render specific chunks (after a fix)
  python tools/render.py --clean         # drop all chunks first
Options: --concurrency N (default 3: safe on a 16 GB machine), --chunk FRAMES (default 1500)
"""
import argparse
import os
import shutil
import subprocess
import sys

from common import STUDIO, load_json, paths

NPX = "npx.cmd" if os.name == "nt" else "npx"


def total_frames(P) -> int:
    """Mirrors layout() in studio/src/Main.tsx, including its per-segment rounding."""
    script = load_json(P.script)
    timings = load_json(P.timings)
    f = round(script["lesson"]["bumperSeconds"] * 30)
    for s in script["segments"]:
        f += round((timings[s["id"]]["duration"] + s["tail"]) * 30)
    return f


def remotion(args):
    cmd = [NPX, "remotion", "render", "src/index.ts", "Lesson", *args, "--log=error"]
    print(" ".join(args), flush=True)
    subprocess.run(cmd, cwd=STUDIO, check=True)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--concurrency", type=int, default=3)
    ap.add_argument("--chunk", type=int, default=1500)
    ap.add_argument("--scale", type=float, default=1.0)
    ap.add_argument("--redo", default="")
    ap.add_argument("--clean", action="store_true")
    ap.add_argument("--name", default="", help="output base name (default Lesson-<lesson>)")
    a = ap.parse_args()
    P = paths()
    name = a.name or P.name

    tag = "" if a.scale == 1 else f"_s{a.scale}"
    cdir = os.path.join(P.out, f"chunks{tag}")
    if a.clean and os.path.isdir(cdir):
        shutil.rmtree(cdir)
    os.makedirs(cdir, exist_ok=True)

    n = total_frames(P)
    ranges = [(s, min(n, s + a.chunk) - 1) for s in range(0, n, a.chunk)]
    redo = {int(x) for x in a.redo.split(",") if x}
    scale = [] if a.scale == 1 else [f"--scale={a.scale}"]
    print(f"{n} frames, {len(ranges)} chunks", flush=True)

    for i, (s, e) in enumerate(ranges):
        path = os.path.join(cdir, f"c{i:02d}_{s}-{e}.mp4")
        stale = [p for p in os.listdir(cdir) if p.startswith(f"c{i:02d}_") and p != os.path.basename(path)]
        for p in stale:  # layout changed: old range no longer valid
            os.remove(os.path.join(cdir, p))
        if os.path.exists(path) and i not in redo:
            continue
        tmp = path + ".part.mp4"
        remotion([tmp, f"--frames={s}-{e}", "--muted", "--codec=h264", "--crf=16", "--x264-preset=medium",
                  f"--concurrency={a.concurrency}", *scale])
        os.replace(tmp, path)
        print(f"chunk {i} done", flush=True)

    audio = os.path.join(cdir, "audio.wav")
    remotion([audio, "--codec=wav", f"--concurrency={a.concurrency}"])

    listfile = os.path.join(cdir, "list.txt")
    with open(listfile, "w") as f:
        for i, (s, e) in enumerate(ranges):
            f.write(f"file 'c{i:02d}_{s}-{e}.mp4'\n")
    final = os.path.join(P.out, f"{name}{tag}.mp4")
    subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-f", "concat", "-safe", "0", "-i", listfile,
                    "-i", audio, "-map", "0:v", "-map", "1:a", "-c:v", "copy", "-c:a", "aac", "-b:a", "192k",
                    "-movflags", "+faststart", "-shortest", final], check=True)
    print("wrote", final, flush=True)


if __name__ == "__main__":
    sys.exit(main())
