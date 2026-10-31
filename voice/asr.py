"""Speech-to-text with word timestamps (faster-whisper). Decodes audio via ffmpeg."""
import subprocess

import numpy as np

_model = None


def load_audio(path: str, sr: int = 16000) -> np.ndarray:
    raw = subprocess.run(
        ["ffmpeg", "-nostdin", "-loglevel", "error", "-i", path, "-f", "f32le", "-ac", "1", "-ar", str(sr), "-"],
        capture_output=True, check=True,
    ).stdout
    return np.frombuffer(raw, dtype=np.float32).copy()


def model():
    global _model
    if _model is None:
        from faster_whisper import WhisperModel
        _model = WhisperModel("small.en", device="cpu", compute_type="int8")
    return _model


def transcribe(path: str, prompt: str = ""):
    """Return (text, [{w, start, end}])."""
    segs, _ = model().transcribe(load_audio(path), beam_size=5, word_timestamps=True,
                                 initial_prompt=prompt or None)
    words, texts = [], []
    for s in segs:
        texts.append(s.text.strip())
        for w in s.words or []:
            words.append({"w": w.word.strip(), "start": round(w.start, 3), "end": round(w.end, 3)})
    return " ".join(texts), words


if __name__ == "__main__":
    import sys
    for p in sys.argv[1:]:
        print(p, "->", transcribe(p)[0], flush=True)
