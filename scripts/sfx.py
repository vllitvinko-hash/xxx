"""Synthesize the background music loop and sound effects into public/.

Usage: python3 scripts/sfx.py
"""
import wave
from pathlib import Path

import numpy as np

SR = 44100
ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public"
rng = np.random.default_rng(7)


def save(name, x, stereo=False):
    x = np.asarray(x, dtype=np.float64)
    x = x / max(np.abs(x).max(), 1e-9) * 0.9
    path = OUT / name
    path.parent.mkdir(parents=True, exist_ok=True)
    with wave.open(str(path), "wb") as w:
        w.setnchannels(2 if stereo else 1)
        w.setsampwidth(2)
        w.setframerate(SR)
        data = (x.T if stereo else x) * 32767
        w.writeframes(data.astype(np.int16).tobytes())


def t(sec):
    return np.arange(int(sec * SR)) / SR


def env(n, a=0.005, r=0.1):
    e = np.ones(n)
    na, nr = int(a * SR), int(r * SR)
    e[:na] = np.linspace(0, 1, na)
    if nr:
        e[-nr:] *= np.linspace(1, 0, nr)
    return e


def lowpass(x, k):
    return np.convolve(x, np.ones(k) / k, mode="same")


def pluck(freq, dur, bright=0.5):
    """Karplus-Strong plucked string (pizzicato)."""
    n = int(dur * SR)
    p = max(int(SR / freq), 2)
    buf = rng.uniform(-1, 1, p)
    buf = lowpass(buf, 3) if bright < 0.5 else buf
    out = np.empty(n)
    for i in range(n):
        out[i] = buf[i % p]
        buf[i % p] = 0.5 * (buf[i % p] + buf[(i + 1) % p]) * 0.994
    return out * env(n, 0.002, min(0.05, dur / 2))


def note(name):
    names = {"C": 0, "C#": 1, "D": 2, "D#": 3, "E": 4, "F": 5, "F#": 6, "G": 7, "G#": 8, "A": 9, "A#": 10, "B": 11}
    pitch, octave = name[:-1], int(name[-1])
    return 440 * 2 ** ((names[pitch] + 12 * (octave + 1) - 69) / 12)


# ---------- music: playful pizzicato in D minor, 116 bpm, 16 bars, looped ----------
BPM = 116
beat = 60 / BPM
bars = [  # (bass root, chord tones)
    ("D2", ["D4", "F4", "A4"]), ("A1", ["C#4", "E4", "A4"]), ("D2", ["D4", "F4", "A4"]), ("A1", ["C#4", "E4", "G4"]),
    ("G1", ["D4", "G4", "A#4"]), ("D2", ["D4", "F4", "A4"]), ("A1", ["C#4", "E4", "A4"]), ("D2", ["D4", "F4", "A4"]),
]
melody = [  # one note per eighth, None = rest (two phrases)
    "A4", None, "D5", None, "C#5", "D5", "E5", None,
    "E5", None, "A4", None, "C#5", None, "E5", None,
    "F5", "E5", "D5", None, "A4", None, "F4", None,
    "G4", None, "A4", "A#4", "A4", None, "E4", None,
    "D5", None, "A#4", None, "G4", "A4", "A#4", None,
    "A4", None, "F4", None, "D4", None, "F4", "A4",
    "E5", None, "C#5", None, "A4", "B4", "C#5", None,
    "D5", None, None, None, "A4", None, "D4", None,
]
loop_len = len(bars) * 4 * beat
music = np.zeros(int(loop_len * SR) + SR)


def place(buf, x, at, gain):
    i = int(at * SR)
    buf[i:i + len(x)] += x[: len(buf) - i] * gain


for b, (root, chord) in enumerate(bars):
    t0 = b * 4 * beat
    for k in range(4):  # bass on every beat, octave jump on 2 and 4
        f = note(root) * (2 if k % 2 else 1)
        place(music, pluck(f, beat * 0.9, 0.3), t0 + k * beat, 0.55)
    for k in (1, 3):  # off-beat chord stabs
        for c in chord:
            place(music, pluck(note(c), beat * 0.45, 0.3), t0 + k * beat + beat / 2, 0.12)
for i, m in enumerate(melody):
    if m:
        place(music, pluck(note(m), beat * 0.5, 0.8), i * beat / 2, 0.3)
# soft shaker on eighths
for i in range(len(bars) * 8):
    sh = rng.normal(0, 1, int(0.04 * SR)) * np.exp(-np.linspace(0, 8, int(0.04 * SR)))
    sh = sh - lowpass(sh, 8)
    place(music, sh, i * beat / 2, 0.05 if i % 2 else 0.08)
music = music[: int(loop_len * SR)]
reps = int(np.ceil(100 / loop_len))
music = np.tile(music, reps)
stereo = np.stack([music, np.roll(music, int(0.012 * SR))])
save("music.wav", stereo, stereo=True)

# ---------- sound effects ----------
# whoosh: band-passed noise swelling and fading
n = t(0.45)
x = rng.normal(0, 1, len(n))
x = lowpass(x, 6) - lowpass(x, 40)
save("sfx/whoosh.wav", x * np.sin(np.pi * n / n[-1]) ** 2)

# pop: short pitched blip
n = t(0.12)
save("sfx/pop.wav", np.sin(2 * np.pi * (500 + 900 * n / n[-1]) * n) * np.exp(-n * 30))

# stamp: low thump plus a click
n = t(0.35)
thump = np.sin(2 * np.pi * (120 * np.exp(-n * 6)) * n) * np.exp(-n * 14)
click = rng.normal(0, 1, len(n)) * np.exp(-n * 120)
save("sfx/stamp.wav", thump + 0.5 * click)

# rewind: VHS-like fast chirps falling in pitch with tape noise
n = t(1.1)
f = 2200 * np.exp(-n * 1.6)
phase = 2 * np.pi * np.cumsum(f) / SR
chirp = np.sign(np.sin(phase)) * 0.25 * (0.5 + 0.5 * np.sin(2 * np.pi * 14 * n))
noise = lowpass(rng.normal(0, 1, len(n)), 3) * 0.25
save("sfx/rewind.wav", (chirp + noise) * env(len(n), 0.02, 0.15))

# level up: rising arpeggio of square-ish blips + sparkle
lv = np.zeros(int(1.0 * SR))
for i, nm in enumerate(["C5", "E5", "G5", "C6", "E6", "G6"]):
    d = t(0.16)
    blip = np.sign(np.sin(2 * np.pi * note(nm) * d)) * 0.4 + np.sin(2 * np.pi * note(nm) * d)
    place(lv, blip * np.exp(-d * 10), i * 0.075, 0.6)
d = t(0.5)
place(lv, np.sin(2 * np.pi * note("C7") * d) * np.exp(-d * 6), 0.45, 0.4)
save("sfx/levelup.wav", lv)

# shh: high-passed noise
n = t(0.9)
x = rng.normal(0, 1, len(n))
x = x - lowpass(x, 5)
save("sfx/shh.wav", x * env(len(n), 0.08, 0.3))

# rooster squawk, cut short: buzzy falling tone
n = t(0.35)
f = 900 - 500 * n / n[-1]
ph = 2 * np.pi * np.cumsum(f) / SR
sq = np.sin(ph) + 0.6 * np.sin(2 * ph) + 0.4 * np.sign(np.sin(3 * ph))
save("sfx/squawk.wav", sq * (0.6 + 0.4 * np.sin(2 * np.pi * 40 * n)) * env(len(n), 0.01, 0.05))

# ding: price-tag cash register bell
n = t(0.6)
save("sfx/ding.wav", (np.sin(2 * np.pi * 1760 * n) + 0.5 * np.sin(2 * np.pi * 2640 * n)) * np.exp(-n * 7))

# gulp: two falling bubbles
g = np.zeros(int(0.4 * SR))
for i in range(2):
    d = t(0.12)
    place(g, np.sin(2 * np.pi * (380 - 1500 * d) * d) * np.exp(-d * 25), i * 0.14, 1)
save("sfx/gulp.wav", g)

# scrolls dropping: a few soft thuds
sc = np.zeros(int(0.7 * SR))
for i, at in enumerate([0.0, 0.12, 0.2, 0.33, 0.41]):
    d = t(0.12)
    place(sc, lowpass(rng.normal(0, 1, len(d)), 12) * np.exp(-d * 40), at, 0.6 + 0.1 * i)
save("sfx/scrolls.wav", sc)

# record scratch for the "fake" twist
n = t(0.4)
f = 300 + 1400 * np.abs(np.sin(2 * np.pi * 2.5 * n))
ph = 2 * np.pi * np.cumsum(f) / SR
save("sfx/scratch.wav", (np.sin(ph) * 0.5 + rng.normal(0, 0.4, len(n))) * env(len(n), 0.005, 0.1))


# the music loop is large as WAV; keep an MP3 in the repo instead
import subprocess  # noqa: E402

subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(OUT / "music.wav"), "-b:a", "160k", str(OUT / "music.mp3")], check=True)
(OUT / "music.wav").unlink()
print("ok")
