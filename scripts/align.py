"""Use a recorded voice-over instead of the synthesized one.

Usage: python3 scripts/align.py <voice.mp3|wav> <models_dir>
Copies the recording to public/voice.wav and rewrites src/Caligula/timeline.json
with phrase timings found by aligning GigaAM speech recognition (character
timestamps) against the phrases in scripts/narration.json.
"""
import difflib
import json
import re
import subprocess
import sys
import tempfile
import wave
from pathlib import Path

import numpy as np
import sherpa_onnx

ROOT = Path(__file__).resolve().parent.parent
src, models = Path(sys.argv[1]), Path(sys.argv[2])
asr_dir = models / "sherpa-onnx-nemo-ctc-giga-am-russian-2024-10-24"
narration = json.loads((ROOT / "scripts" / "narration.json").read_text())

subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(src), "-ac", "1", "-ar", "44100", str(ROOT / "public" / "voice.wav")], check=True)
with tempfile.TemporaryDirectory() as tmp:
    wav16 = Path(tmp) / "v.wav"
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(src), "-ac", "1", "-ar", "16000", str(wav16)], check=True)
    with wave.open(str(wav16)) as w:
        audio = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float32) / 32768
SR = 16000
duration = len(audio) / SR

asr = sherpa_onnx.OfflineRecognizer.from_nemo_ctc(
    model=str(asr_dir / "model.int8.onnx"), tokens=str(asr_dir / "tokens.txt"), num_threads=4
)

# Recognize in ~15 s chunks, cutting at the quietest 100 ms between 12 and 18 s
# so that words are not split.
frame = SR // 10
rms = np.array([np.sqrt(np.mean(audio[i:i + frame] ** 2)) for i in range(0, len(audio), frame)])
words = []  # (word, start, end)
pos = 0
while pos < len(audio):
    lo, hi = pos + 12 * SR, pos + 18 * SR
    if hi >= len(audio):
        cut = len(audio)
    else:
        a, b = lo // frame, hi // frame
        cut = (a + int(np.argmin(rms[a:b]))) * frame + frame // 2
    stream = asr.create_stream()
    stream.accept_waveform(SR, audio[pos:cut])
    asr.decode_stream(stream)
    r = stream.result
    word, ws, we = "", None, None
    for tok, t in zip(list(r.tokens) + [" "], list(r.timestamps) + [None]):
        if tok.strip() == "" or tok == "▁":
            if word:
                words.append((word, ws, we + 0.12))
            word, ws = "", None
            continue
        tok = tok.replace("▁", "")
        if not word:
            ws = pos / SR + t
        word += tok
        we = pos / SR + t
    pos = cut


def norm(text):
    return re.sub(r"[^а-я ]", " ", text.lower().replace("ё", "е").replace("-", " ")).split()


ref = []  # (word, scene index, line index)
for si, scene in enumerate(narration["scenes"]):
    for li, line in enumerate(scene["lines"]):
        ref += [(wd, si, li) for wd in norm(line["say"])]

hyp = [w for w, _, _ in words]
matcher = difflib.SequenceMatcher(a=[w for w, _, _ in ref], b=hyp, autojunk=False)
times = [None] * len(ref)
for a, b, n in matcher.get_matching_blocks():
    for k in range(n):
        times[a + k] = words[b + k][1:]
matched = sum(t is not None for t in times)
print(f"matched {matched}/{len(ref)} words")

# Fill gaps by interpolating between matched neighbours.
known = [i for i, t in enumerate(times) if t]
for i, t in enumerate(times):
    if t:
        continue
    prev = max([k for k in known if k < i], default=None)
    nxt = min([k for k in known if k > i], default=None)
    s = times[prev][1] if prev is not None else 0.0
    e = times[nxt][0] if nxt is not None else duration
    span = (nxt if nxt is not None else len(ref)) - (prev if prev is not None else -1)
    k = i - (prev if prev is not None else -1)
    times[i] = (s + (e - s) * (k - 1) / span, s + (e - s) * k / span)

timeline = []
for si, scene in enumerate(narration["scenes"]):
    lines = []
    for li, line in enumerate(scene["lines"]):
        idx = [i for i, r in enumerate(ref) if r[1] == si and r[2] == li]
        lines.append({"text": line["sub"], "start": round(times[idx[0]][0] - 0.05, 3), "end": round(times[idx[-1]][1], 3)})
    timeline.append({"id": scene["id"], "start": lines[0]["start"], "end": lines[-1]["end"], "lines": lines})

out = {"duration": round(duration, 3), "scenes": timeline}
(ROOT / "src" / "Caligula" / "timeline.json").write_text(json.dumps(out, ensure_ascii=False, indent=1))
print(f"duration={duration:.2f}s")
for s in timeline:
    print(f"  {s['id']:9s} {s['start']:6.2f} – {s['end']:6.2f}")
