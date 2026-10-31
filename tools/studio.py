"""Run the Remotion studio from the repo root, so every command in this project starts with `python tools/`.

  python tools/studio.py tsc                                 type-check the studio (catches most scene-map mistakes)
  python tools/studio.py still Lesson 2890 out/1.2/x.png     render one frame of the lesson (frame from tools/frame_at.py)
  python tools/studio.py still Thumbnail out/1.2/thumbnail.png
  python tools/studio.py frames 2880-2940 out/1.2/smoke.mp4  render a short range (muted) to test clips and audio paths
  python tools/studio.py open                                open the interactive Remotion Studio in the browser
"""
import os
import subprocess
import sys

from common import ROOT, STUDIO

NPX = "npx.cmd" if os.name == "nt" else "npx"


def run(*args):
    print("studio:", " ".join(args), flush=True)
    return subprocess.run([NPX, *args], cwd=STUDIO, check=False).returncode


def main(argv):
    if not argv:
        sys.exit(__doc__)
    cmd, rest = argv[0], argv[1:]
    if cmd == "tsc":
        return run("tsc", "--noEmit")
    if cmd == "still":
        comp = rest[0]
        if comp == "Thumbnail":
            out = rest[1]
            frame = []
        else:
            frame = [f"--frame={rest[1]}"]
            out = rest[2]
        out = os.path.abspath(os.path.join(ROOT, out)) if not os.path.isabs(out) else out
        os.makedirs(os.path.dirname(out), exist_ok=True)
        return run("remotion", "still", "src/index.ts", comp, out, *frame, "--log=error")
    if cmd == "frames":
        out = rest[1]
        out = os.path.abspath(os.path.join(ROOT, out)) if not os.path.isabs(out) else out
        os.makedirs(os.path.dirname(out), exist_ok=True)
        return run("remotion", "render", "src/index.ts", "Lesson", out, f"--frames={rest[0]}", "--muted",
                   "--concurrency=2", "--log=error")
    if cmd == "open":
        return run("remotion", "studio", "src/index.ts")
    sys.exit(__doc__)


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
