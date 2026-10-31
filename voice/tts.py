"""Generate narration with Kokoro (Apache-2.0), one WAV + word timings per segment.

Works on the ACTIVE lesson (lessons/CURRENT). Usage:
  voice/.venv/Scripts/python voice/tts.py                 # all segments
  voice/.venv/Scripts/python voice/tts.py --only s01,s02  # after editing some narration
  voice/.venv/Scripts/python voice/tts.py --samples       # voice comparison clips into voice/out/samples
"""
import argparse
import json
import os
import sys

import numpy as np
import soundfile as sf

from master import master
from textutil import align_display_to_audio, display_words, split_sentences, tts_text

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, "tools"))
from common import paths  # noqa: E402

P = paths()
SCRIPT = P.script
AUDIO_DIR = P.audio
TIMINGS = P.timings
RAW_DIR = P.raw_audio
SR = 24000
SENTENCE_GAP = 0.38  # seconds of air between sentences: a calm teaching pace

_pipe = None


def pipeline():
    global _pipe
    if _pipe is None:
        from kokoro import KPipeline
        _pipe = KPipeline(lang_code="a", repo_id="hexgrad/Kokoro-82M")
    return _pipe


def synth(text: str, voice: str, speed: float):
    """Return (audio ndarray, [{w,start,end}]) for a block of text."""
    chunks, words, t = [], [], 0.0
    for sent in split_sentences(text):
        for res in pipeline()(tts_text(sent), voice=voice, speed=speed, split_pattern=None):
            audio = res.audio.detach().cpu().numpy() if hasattr(res.audio, "detach") else np.asarray(res.audio)
            for tok in res.tokens or []:
                if tok.start_ts is None or tok.end_ts is None:
                    continue
                words.append({"w": tok.text, "start": round(t + tok.start_ts, 3), "end": round(t + tok.end_ts, 3)})
            chunks.append(audio)
            t += len(audio) / SR
        gap = np.zeros(int(SENTENCE_GAP * SR), dtype=np.float32)
        chunks.append(gap)
        t += SENTENCE_GAP
    if chunks:
        chunks.pop()  # no trailing gap
    return np.concatenate(chunks).astype(np.float32), words


def build_segment(seg, voice, speed, timings):
    os.makedirs(RAW_DIR, exist_ok=True)
    os.makedirs(AUDIO_DIR, exist_ok=True)
    audio, audio_words = synth(seg["text"], voice, speed)
    raw = os.path.join(RAW_DIR, f"{seg['id']}.wav")
    sf.write(raw, audio, SR)
    master(raw, os.path.join(AUDIO_DIR, f"{seg['id']}.wav"))
    disp = display_words(seg["text"])
    spans = align_display_to_audio(disp, audio_words)
    timings[seg["id"]] = {
        "duration": round(len(audio) / SR, 3),
        "source": f"kokoro:{voice}@{speed}",
        "words": [{"w": w, "start": round(s, 3), "end": round(e, 3)} for w, (s, e) in zip(disp, spans)],
    }
    print(f"{seg['id']}: {timings[seg['id']]['duration']:.1f}s, {len(disp)} words", flush=True)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--voice", default="am_michael")
    ap.add_argument("--speed", type=float, default=0.95)
    ap.add_argument("--only", default="")
    ap.add_argument("--samples", action="store_true")
    args = ap.parse_args()

    script = json.load(open(SCRIPT, encoding="utf-8"))
    if args.samples:
        out = os.path.join(ROOT, "voice", "out", "samples")
        os.makedirs(out, exist_ok=True)
        text = script["segments"][2]["text"]
        for v in ["am_michael", "am_fenrir", "am_puck", "am_onyx", "bm_george", "bm_fable", "bm_lewis"]:
            a, _ = synth(text, v, args.speed)
            raw = os.path.join(out, f"{v}_raw.wav")
            sf.write(raw, a, SR)
            master(raw, os.path.join(out, f"{v}.wav"))
            os.remove(raw)
            print("sample", v, flush=True)
        return

    timings = json.load(open(TIMINGS, encoding="utf-8")) if os.path.exists(TIMINGS) else {}
    only = set(filter(None, args.only.split(",")))
    for seg in script["segments"]:
        if only and seg["id"] not in only:
            continue
        build_segment(seg, args.voice, args.speed, timings)
    os.makedirs(os.path.dirname(TIMINGS), exist_ok=True)
    json.dump(timings, open(TIMINGS, "w", encoding="utf-8"), indent=1)


if __name__ == "__main__":
    sys.exit(main())
