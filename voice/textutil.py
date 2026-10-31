"""Shared text helpers: sentence splitting, TTS substitutions, word alignment."""
import difflib
import re

# Display text -> what the TTS engine should say. Applied only for synthesis;
# subtitles and anchors always use the display text.
TTS_SUBS = [
    (r"\bGNU/Linux\b", "guh-new slash Linux"),
    (r"/etc\b", "slash E T C"),
    (r"\bmacOS\b", "mac O S"),
    (r"\biOS\b", "eye O S"),
    (r"\bOS\b", "O S"),
    (r"\buname\b", "you-name"),
    (r"\$SHELL\b", "dollar SHELL"),
    (r"\bps aux\b", "P S, A, U, X"),
    (r"\bPID\b", "P I D"),
    (r"\bCPU\b", "C P U"),
    (r"\bUSB\b", "U S B"),
    (r"\bWSL\b", "W S L"),
    (r"\bx86_64\b", "x86, 64"),
    (r"\b1\.5\b", "one point five"),
    (r"\b1\.2\b", "one point two"),
    (r"-a\b", "dash [A](/ˈA/),"),
    (r"-r\b", "dash R"),
    (r"-h\b", "dash H"),
]


def tts_text(text: str) -> str:
    for pat, rep in TTS_SUBS:
        text = re.sub(pat, rep, text)
    return text


def split_sentences(text: str):
    parts = re.split(r"(?<=[.?!])\s+", text.strip())
    return [p for p in parts if p]


def norm(w: str) -> str:
    return re.sub(r"[^a-z0-9]", "", w.lower())


def display_words(text: str):
    return text.split()


def align_display_to_audio(display: list, audio: list):
    """Map each display word to (start, end) using audio word timings.

    display: list of str. audio: list of dicts {w, start, end}.
    Unmatched display words are interpolated between matched neighbours.
    """
    a_norm = [norm(x["w"]) for x in audio]
    d_norm = [norm(x) for x in display]
    sm = difflib.SequenceMatcher(a=d_norm, b=a_norm, autojunk=False)
    times = [None] * len(display)
    for blk in sm.get_matching_blocks():
        for k in range(blk.size):
            aw = audio[blk.b + k]
            times[blk.a + k] = (aw["start"], aw["end"])
    # interpolate gaps
    known = [i for i, t in enumerate(times) if t is not None]
    if not known:
        total = audio[-1]["end"] if audio else 1.0
        step = total / max(1, len(display))
        return [(i * step, (i + 1) * step) for i in range(len(display))]
    for i in range(len(times)):
        if times[i] is not None:
            continue
        prev = max([k for k in known if k < i], default=None)
        nxt = min([k for k in known if k > i], default=None)
        if prev is None:
            times[i] = (times[nxt][0], times[nxt][0])
        elif nxt is None:
            times[i] = (times[prev][1], times[prev][1])
        else:
            t0, t1 = times[prev][1], times[nxt][0]
            span = nxt - prev
            f0, f1 = (i - prev - 1) / (span - 1 or 1), (i - prev) / (span - 1 or 1)
            times[i] = (t0 + (t1 - t0) * f0, t0 + (t1 - t0) * min(1, f1))
    return times
