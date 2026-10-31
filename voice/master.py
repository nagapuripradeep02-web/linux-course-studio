"""Loudness mastering for narration: high-pass, gentle compression, two-pass loudnorm to -16 LUFS."""
import json
import re
import subprocess

TARGET_I, TARGET_TP, TARGET_LRA = -16.0, -1.5, 7.0


def master(src: str, dst: str, denoise: bool = False) -> None:
    pre = "highpass=f=80"
    if denoise:
        pre += ",afftdn=nf=-25"
    pre += ",acompressor=threshold=-20dB:ratio=2.5:attack=10:release=150:makeup=2"
    measure = subprocess.run(
        ["ffmpeg", "-hide_banner", "-nostats", "-i", src, "-af",
         f"{pre},loudnorm=I={TARGET_I}:TP={TARGET_TP}:LRA={TARGET_LRA}:print_format=json",
         "-f", "null", "-"],
        capture_output=True, text=True, check=True,
    ).stderr
    m = json.loads(re.search(r"\{[^{}]*\"input_i\"[^{}]*\}", measure, re.S).group(0))
    ln = (f"loudnorm=I={TARGET_I}:TP={TARGET_TP}:LRA={TARGET_LRA}"
          f":measured_I={m['input_i']}:measured_TP={m['input_tp']}"
          f":measured_LRA={m['input_lra']}:measured_thresh={m['input_thresh']}"
          f":offset={m['target_offset']}:linear=true")
    subprocess.run(
        ["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-i", src, "-af",
         f"{pre},{ln}", "-ar", "48000", "-ac", "1", dst],
        check=True,
    )
