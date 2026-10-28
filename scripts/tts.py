"""Generate the voiceover with an offline Piper voice (sherpa-onnx).

Usage: python3 scripts/tts.py <models_dir> [voice]
Writes public/voice.wav and src/Caligula/timeline.json (phrase timings in seconds).

If <models_dir> also holds the GigaAM Russian ASR model, each phrase is
synthesized several times and the take the recognizer understands best is kept.
"""
import json
import re
import sys
import wave
from pathlib import Path

import numpy as np
import sherpa_onnx

ROOT = Path(__file__).resolve().parent.parent
GAP = 0.12  # silence between phrases
SCENE_GAP = 0.3  # extra silence between scenes
LEAD_IN = 0.15

narration = json.loads((ROOT / "scripts" / "narration.json").read_text())
voice = sys.argv[2] if len(sys.argv) > 2 else narration["voice"]
mdir = Path(sys.argv[1]) / f"vits-piper-ru_RU-{voice}"

tts = sherpa_onnx.OfflineTts(
    sherpa_onnx.OfflineTtsConfig(
        model=sherpa_onnx.OfflineTtsModelConfig(
            vits=sherpa_onnx.OfflineTtsVitsModelConfig(
                model=str(mdir / f"ru_RU-{voice}.onnx"),
                tokens=str(mdir / "tokens.txt"),
                data_dir=str(mdir / "espeak-ng-data"),
                length_scale=narration.get("length_scale", 1.0),
            ),
            num_threads=4,
        )
    )
)

ASR_DIR = Path(sys.argv[1]) / "sherpa-onnx-nemo-ctc-giga-am-russian-2024-10-24"
TAKES = 5
asr = None
if ASR_DIR.exists():
    asr = sherpa_onnx.OfflineRecognizer.from_nemo_ctc(
        model=str(ASR_DIR / "model.int8.onnx"), tokens=str(ASR_DIR / "tokens.txt"), num_threads=4
    )


def words(text):
    return re.sub(r"[^а-я ]", "", text.lower().replace("ё", "е").replace("-", " ")).split()


def distance(a, b):
    d = list(range(len(b) + 1))
    for i in range(1, len(a) + 1):
        prev, d[0] = d[:], i
        for j in range(1, len(b) + 1):
            d[j] = min(prev[j] + 1, d[j - 1] + 1, prev[j - 1] + (a[i - 1] != b[j - 1]))
    return d[-1]


def errors(samples, rate, text):
    x = np.interp(np.arange(0, len(samples), rate / 16000), np.arange(len(samples)), samples)
    stream = asr.create_stream()
    stream.accept_waveform(16000, x.astype(np.float32))
    asr.decode_stream(stream)
    return distance(words(text), words(stream.result.text))


def trim(s, rate):
    """Cut leading/trailing near-silence, keeping a margin for soft word endings."""
    nz = np.where(np.abs(s) > 0.004)[0]
    if not len(nz):
        return s
    return s[max(nz[0] - int(0.03 * rate), 0): nz[-1] + int(0.15 * rate)]


def synth(text):
    best, best_err = None, None
    for _ in range(TAKES if asr else 1):
        audio = tts.generate(text, sid=0, speed=1.0)
        s = trim(np.array(audio.samples, dtype=np.float32), audio.sample_rate)
        if not asr:
            return s
        err = errors(s, audio.sample_rate, text)
        if best_err is None or err < best_err:
            best, best_err = s, err
        if err == 0:
            break
    return best


sr = None
chunks = []
t = 0.0


def add(samples):
    global t
    chunks.append(samples)
    t += len(samples) / sr


timeline = []
for si, scene in enumerate(narration["scenes"]):
    if sr is None:
        sr = tts.sample_rate
        add(np.zeros(int(LEAD_IN * sr), dtype=np.float32))
    elif si > 0:
        add(np.zeros(int(SCENE_GAP * sr), dtype=np.float32))
    start = t
    lines = []
    for line in scene["lines"]:
        s = synth(line["say"])
        ls = t
        add(s)
        lines.append({"text": line["sub"], "start": round(ls, 3), "end": round(t, 3)})
        add(np.zeros(int((GAP + line.get("pause", 0)) * sr), dtype=np.float32))
    timeline.append({"id": scene["id"], "start": round(start, 3), "end": round(t, 3), "lines": lines})

add(np.zeros(int(1.2 * sr), dtype=np.float32))
full = np.concatenate(chunks)
full = full / max(np.abs(full).max(), 1e-6) * 0.89

(ROOT / "public").mkdir(exist_ok=True)
with wave.open(str(ROOT / "public" / "voice.wav"), "wb") as w:
    w.setnchannels(1)
    w.setsampwidth(2)
    w.setframerate(sr)
    w.writeframes((full * 32767).astype(np.int16).tobytes())

out = {"duration": round(t, 3), "scenes": timeline}
(ROOT / "src" / "Caligula").mkdir(parents=True, exist_ok=True)
(ROOT / "src" / "Caligula" / "timeline.json").write_text(json.dumps(out, ensure_ascii=False, indent=1))
print(f"voice={voice} duration={t:.2f}s")
for s in timeline:
    print(f"  {s['id']:9s} {s['start']:6.2f} – {s['end']:6.2f}")
