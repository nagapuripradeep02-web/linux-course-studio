"""Technical QA of a finished render: container, loudness, duration vs the timeline, captions.

  python tools/check.py                    # out/<lesson>/Lesson-<lesson>.mp4
  python tools/check.py path/to/video.mp4

Prints one line per check with PASS / WARN / FAIL. Course delivery targets: 1920x1080, 30 fps, H.264 + AAC,
integrated loudness -16 LUFS (+/-1), true peak below -1 dBTP, captions ending inside the video.
"""
import json
import os
import re
import subprocess
import sys

from common import paths, segment_starts

results = []


def report(status, name, detail):
    results.append(status)
    print(f"{status:4} {name:<22} {detail}")


def main():
    P = paths()
    video = sys.argv[1] if len(sys.argv) > 1 else os.path.join(P.out, f"{P.name}.mp4")
    if not os.path.exists(video):
        sys.exit(f"not found: {video}")

    probe = json.loads(subprocess.run(
        ["ffprobe", "-v", "error", "-print_format", "json", "-show_streams", "-show_format", video],
        capture_output=True, text=True, check=True).stdout)
    v = next(s for s in probe["streams"] if s["codec_type"] == "video")
    aud = next((s for s in probe["streams"] if s["codec_type"] == "audio"), None)
    dur = float(probe["format"]["duration"])
    num, den = v["r_frame_rate"].split("/")
    fps = int(num) / int(den)
    size_mb = os.path.getsize(video) / 1e6

    ok = v["width"] == 1920 and v["height"] == 1080 and v["codec_name"] == "h264"
    report("PASS" if ok else "FAIL", "video", f"{v['width']}x{v['height']} {v['codec_name']} {fps:g} fps, {size_mb:.1f} MB")
    report("PASS" if abs(fps - 30) < 0.01 else "FAIL", "frame rate", f"{fps:g} fps")
    report("PASS" if aud and aud["codec_name"] == "aac" else "FAIL", "audio", f"{aud['codec_name'] if aud else 'none'}")

    _, expected = segment_starts(P)
    diff = dur - expected
    report("PASS" if abs(diff) < 0.5 else "WARN", "duration",
           f"{dur:.2f}s = {int(dur // 60)}:{int(dur % 60):02d} (timeline says {expected:.2f}s, diff {diff:+.2f}s)")

    loud = subprocess.run(["ffmpeg", "-hide_banner", "-nostats", "-i", video, "-af", "ebur128=peak=true", "-f", "null", "-"],
                          capture_output=True, text=True).stderr
    i_lufs = re.findall(r"I:\s+(-?[\d.]+) LUFS", loud)
    tp = re.findall(r"Peak:\s+(-?[\d.]+) dBFS", loud)
    if i_lufs:
        li = float(i_lufs[-1])
        report("PASS" if abs(li + 16) <= 1.0 else "WARN", "loudness", f"{li:.1f} LUFS integrated (target -16)")
    else:
        report("WARN", "loudness", "could not measure")
    if tp:
        peak = float(tp[-1])
        report("PASS" if peak <= -1.0 else "WARN", "true peak", f"{peak:.1f} dBTP (limit -1.0)")

    srt = os.path.join(os.path.dirname(video), f"{P.name}.srt")
    if os.path.exists(srt):
        text = open(srt, encoding="utf-8").read()
        ends = re.findall(r"--> (\d\d):(\d\d):(\d\d),(\d\d\d)", text)
        last = ends[-1]
        t_last = int(last[0]) * 3600 + int(last[1]) * 60 + int(last[2]) + int(last[3]) / 1000
        n = len(re.findall(r"^\d+\s*$", text, flags=re.M))
        report("PASS" if t_last <= dur else "FAIL", "captions", f"{n} cues, last ends at {t_last:.1f}s")
    else:
        report("WARN", "captions", f"no {os.path.basename(srt)} next to the video (run tools/export_captions.py)")

    worst = "FAIL" if "FAIL" in results else "WARN" if "WARN" in results else "PASS"
    print(f"\noverall: {worst}")
    return 1 if worst == "FAIL" else 0


if __name__ == "__main__":
    sys.exit(main())
