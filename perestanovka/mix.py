"""«Перестановка»: партитура + фоли материалов → out/mix.wav.
Всё синтезировано numpy (без сэмплов): маримба, вибрафон, колокольчики, пад, пульс-бас, удары.
Читает events.json (core/render/events.mjs). 96 BPM, фа мажор, такт 2.5 с.
Алюминий (чеки) тикает ярко, акрил (соус) — глухо, латунь (каждая десятая) звенит нотой пентатоники вверх.
"""
import os, json
import numpy as np, soundfile as sf
from scipy.signal import butter, sosfilt

HERE = os.path.dirname(os.path.abspath(__file__))
SR = 48000
EV = json.load(open(os.path.join(HERE, "events.json")))["ev"]
DUR = 60.5
BPM = 96; BEAT = 60 / BPM; BAR = BEAT * 4
T = dict(suck1=29.75, lift=30.25, land=31.15, pairVerdict=20.1, resultVerdict=42.6, feed=38.5, suck2=53.0, end=53.5)
N = int((DUR + 3) * SR)
rng = np.random.default_rng(7)
MUS, PUL, HIT, FX, BED = (np.zeros((N, 2)) for _ in range(5))

def sos(kind, f, o=2): return butter(o, f, kind, fs=SR, output="sos")
def lpf(x, f, o=2): return sosfilt(sos("low", min(f, SR * 0.45), o), x, axis=0)
def hpf(x, f, o=2): return sosfilt(sos("high", f, o), x, axis=0)
def bpf(x, a, b, o=2): return sosfilt(sos("band", [a, min(b, SR * 0.45)], o), x, axis=0)
def tv(d): return np.arange(int(d * SR)) / SR
def hz(m): return 440.0 * 2 ** ((m - 69) / 12)
NOTE = {"C": 0, "C#": 1, "Db": 1, "D": 2, "Eb": 3, "E": 4, "F": 5, "F#": 6, "G": 7, "Ab": 8, "A": 9, "Bb": 10, "B": 11}
def mi(n): return 12 * (int(n[-1]) + 1) + NOTE[n[:-1]]
def put(buf, x, at, g=1.0, pan=0.0):
    x = np.asarray(x, np.float64)
    s = int(at * SR)
    if s >= len(buf): return
    if x.ndim == 1:
        l, r = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
        x = np.stack([x * l * 1.414, x * r * 1.414], 1)
    if s < 0: x = x[-s:]; s = 0
    e = min(len(buf), s + len(x)); buf[s:e] += x[: e - s] * g
def adsr(d, a=0.005, r=0.1):
    n = int(d * SR); e = np.ones(n); na = max(1, int(a * SR)); e[:na] = np.linspace(0, 1, na)
    nr = min(n, int(r * SR)); e[n - nr:] *= np.linspace(1, 0, nr) ** 1.5; return e

# ---------- инструменты ----------
def marimba(m, vel=0.6, d=0.9):
    t = tv(d); f = hz(m)
    x = (np.sin(2 * np.pi * f * t) * np.exp(-t / (0.35 if f < 400 else 0.22))
         + 0.35 * np.sin(2 * np.pi * f * 3.93 * t) * np.exp(-t / 0.05)
         + 0.12 * np.sin(2 * np.pi * f * 9.2 * t) * np.exp(-t / 0.015))
    x[: int(0.002 * SR)] *= np.linspace(0, 1, int(0.002 * SR))
    return x * vel
def vibes(m, vel=0.5, d=2.4, trem=5.2):
    t = tv(d); f = hz(m)
    x = np.sin(2 * np.pi * f * t) * np.exp(-t / 1.4) + 0.25 * np.sin(2 * np.pi * f * 4.0 * t) * np.exp(-t / 0.25)
    x *= 1 - 0.25 * (0.5 + 0.5 * np.sin(2 * np.pi * trem * t))
    x[: int(0.003 * SR)] *= np.linspace(0, 1, int(0.003 * SR))
    return x * vel
def glock(m, vel=0.4, d=1.2):
    t = tv(d); f = hz(m)
    x = sum(a * np.sin(2 * np.pi * f * r * t + rng.random() * 6) * np.exp(-t / tau) for r, a, tau in [(1, 1, 0.7), (2.76, 0.4, 0.3), (5.4, 0.2, 0.12)])
    return x * vel
def saw(f, d, det=0.0, nh=24):
    t = tv(d); x = np.zeros_like(t)
    for k in range(1, nh):
        if f * k > 12000: break
        x += np.sin(2 * np.pi * f * (1 + det) * k * t) / k
    return x * 0.5
def pad(ms, d, vel=0.22, cut=1400, a=0.9, r=1.2):
    x = np.zeros(int(d * SR))
    for m in ms:
        for det in (-0.0035, 0, 0.004): x += saw(hz(m), d, det, nh=16)
    return lpf(x, cut) * adsr(d, a, r) * vel / max(1, len(ms))
def bass(m, d, vel=0.8):
    f = hz(m); x = np.sin(2 * np.pi * f * tv(d)) * 0.9 + saw(f, d, nh=10) * 0.5
    x = lpf(x, 380) + 0.16 * np.tanh(3 * lpf(x, 900))
    return x * adsr(d, 0.008, min(0.18, d * 0.4)) * vel * 0.8
def bell(m, vel=0.6, d=3.5):
    t = tv(d); f = hz(m)
    return sum(a * np.sin(2 * np.pi * f * r * t + rng.random() * 6) * np.exp(-t / tau) for r, a, tau in [(1, 1, 1.6), (2.0, 0.5, 1.0), (2.76, 0.4, 0.7), (5.4, 0.25, 0.35), (8.93, 0.12, 0.2)]) * vel * 0.5
def punch(vel=1.0, d=0.9):
    t = tv(d)
    b1 = np.sin(2 * np.pi * np.cumsum(66 * (1 + 1.3 * np.exp(-t / 0.025))) / SR) * np.exp(-t / 0.26)
    b2 = np.sin(2 * np.pi * np.cumsum(100 * (1 + 0.8 * np.exp(-t / 0.02))) / SR) * np.exp(-t / 0.14) * 0.6
    kn = bpf(rng.standard_normal(len(t)), 90, 420) * np.exp(-t / 0.045) * 0.7
    y = b1 + b2 + kn; return (y + 0.25 * np.tanh(2.5 * y)) * vel
def timp(m, vel=0.7, d=1.6):
    t = tv(d); f = hz(m)
    x = np.sin(2 * np.pi * f * t) * np.exp(-t / 0.6) + 0.4 * np.sin(2 * np.pi * f * 1.5 * t) * np.exp(-t / 0.3)
    x += bpf(rng.standard_normal(len(t)), 60, 300) * np.exp(-t / 0.03) * 0.5
    return x * vel

# ---------- материалы ----------
def tick_alu(v=1.0):
    d = 0.07; t = tv(d); p = 0.92 + rng.random() * 0.16
    tr = hpf(rng.standard_normal(len(t)), 3000) * np.exp(-t / 0.0012)
    res = sum(a * np.sin(2 * np.pi * f * p * t + rng.random() * 6) * np.exp(-t / tau) for f, a, tau in [(3150, 0.5, 0.02), (5230, 0.35, 0.014), (7480, 0.25, 0.009), (1870, 0.2, 0.012)])
    return (tr * 0.7 + res) * v
def tok_acr(v=1.0):
    d = 0.06; t = tv(d); p = 0.9 + rng.random() * 0.2
    tr = bpf(rng.standard_normal(len(t)), 900, 5000) * np.exp(-t / 0.0018)
    res = sum(a * np.sin(2 * np.pi * f * p * t + rng.random() * 6) * np.exp(-t / tau) for f, a, tau in [(1450, 0.6, 0.012), (2650, 0.35, 0.008), (520, 0.3, 0.015)])
    return (tr * 0.6 + res) * v
def knock_wood(v=1.0):
    d = 0.18; t = tv(d)
    x = sum(a * np.sin(2 * np.pi * f * t) * np.exp(-t / tau) for f, a, tau in [(180, 1, 0.05), (420, 0.6, 0.03), (910, 0.3, 0.015)])
    return (x + bpf(rng.standard_normal(len(t)), 300, 2500) * np.exp(-t / 0.004) * 0.4) * v
def air(d, v=1.0, f0=400, f1=2400):
    n = rng.standard_normal(int(d * SR)); u = np.clip(tv(d) / d, 0, 1)
    lo = lpf(n, f0 * 2); hi = bpf(n, f0, f1)
    return (lo * 0.3 + hi * u) * np.sin(np.pi * u) ** 2 * v

PENTA = ["F5", "G5", "A5", "C6", "D6", "F6", "G6", "A6", "C7", "D7", "F7", "G7"]

# ---------- партитура ----------
CH = {"F": ["F3", "A3", "C4", "E4"], "C/E": ["E3", "G3", "C4", "D4"], "Dm": ["D3", "F3", "A3", "C4"], "Bb": ["Bb2", "D3", "F3", "A3"], "Gm": ["G2", "Bb2", "D3", "F3"], "C": ["C3", "E3", "G3", "D4"]}
PROG = ["F", "C/E", "Dm", "Bb"] * 3 + ["Gm", "C", "F", "Bb"] + ["F", "C/E", "Dm", "Bb"] * 2
ROOT = {"F": "F2", "C/E": "E2", "Dm": "D2", "Bb": "Bb1", "Gm": "G1", "C": "C2"}

def chord_at(t): return PROG[min(int(t // BAR), len(PROG) - 1)]
def score():
    nb = int(DUR // BAR) + 1
    for b in range(nb):
        t0 = b * BAR; c = chord_at(t0)
        ms = [mi(n) for n in CH[c]]
        # пад под всем фильмом; раскрывается к финалу
        cut = 1100 if t0 < 46 else 2000
        put(MUS, pad([m + 12 for m in ms], BAR + 0.6, 0.2 if t0 < 4 else 0.16, cut), t0, 1.0)
        # маримба: восьмые с 4 с, шестнадцатые на рост 36–46, разреживается на плане 24–31
        if 4.0 <= t0 + BAR and t0 < 53:
            sub = 4 if 36 <= t0 < 46 else 2
            arp = [ms[0] + 12, ms[1] + 12, ms[2] + 12, ms[3] + 12, ms[2] + 24, ms[3] + 12, ms[1] + 12, ms[2] + 12]
            steps = 4 * sub
            for k in range(steps):
                t = t0 + k * BEAT / sub
                if t < 4.3 or t > 53: continue
                if 24 <= t < 31.2 and k % 2: continue
                vel = 0.5 if k % sub == 0 else 0.32
                put(MUS, marimba(arp[k % len(arp)], vel), t, 0.55, 0.25 * np.sin(k))
        # пульс-бас четвертями с 5 с
        if t0 + BAR > 5.2 and t0 < 53:
            for k in range(4):
                t = t0 + k * BEAT
                if t < 5.2 or t > 53: continue
                if 24 <= t < 31.2 and k % 2: continue
                put(PUL, bass(mi(ROOT[c]) + (12 if k == 2 else 0), BEAT * 0.9, 0.75), t, 1.0)
    # заставка: одна нота вибрафона
    put(MUS, vibes(mi("A5"), 0.5), 0.15, 0.6, 0.2)
    put(MUS, vibes(mi("C5"), 0.4), 0.15, 0.5, -0.2)
    # вердикты: аккорд вибрафона
    for tv_ in (T["pairVerdict"], T["resultVerdict"]):
        c = chord_at(tv_)
        for i, n in enumerate(CH[c][1:]): put(HIT, vibes(mi(n) + 24, 0.45), tv_ + i * 0.03, 0.55, (i - 1) * 0.3)
    # план зала: сердцебиение литавр перед перестановкой
    for k in range(6): put(HIT, timp(mi("C2") + (0 if k % 2 else 5), 0.5), 26.6 + k * BEAT * 2, 0.45)
    # подача пластин: колокольчики вверх по пентатонике
    # перестановка: удар
    t = T["land"]
    put(HIT, punch(1.0), t, 0.9); put(HIT, timp(mi("F2"), 0.9, 2.2), t, 0.8)
    put(HIT, bell(mi("F5"), 0.7), t, 0.5, 0.15); put(HIT, bell(mi("C5"), 0.5), t, 0.4, -0.2)
    for i, n in enumerate(["F3", "A3", "C4"]): put(HIT, vibes(mi(n) + 12, 0.5, 2.6), t, 0.5, (i - 1) * 0.3)
    # финал: самый тяжёлый удар и последний аккорд
    t = T["end"]
    put(HIT, punch(1.15), t, 1.0); put(HIT, timp(mi("F2"), 1.0, 3.0), t, 0.9)
    put(HIT, bell(mi("F5"), 0.8, 5.0), t, 0.55, 0.15); put(HIT, bell(mi("A4"), 0.6, 5.0), t, 0.45, -0.2); put(HIT, bell(mi("C6"), 0.4, 5.0), t + 0.02, 0.35, 0.3)
    put(MUS, pad([mi(n) + 12 for n in ["F3", "A3", "C4", "G4"]], 7.0, 0.22, 2200, 0.3, 3.5), t, 1.0)
    for k, n in enumerate(["F4", "A4", "C5", "F5", "A5", "C6", "F6"]): put(MUS, glock(mi(n), 0.3, 2.0), t + 0.9 + k * 0.18, 0.5, -0.4 + k * 0.12)

def foley():
    dens_t = [e["t"] for e in EV if e["type"] in ("tick", "tok", "brass")]
    dens_t = np.array(dens_t)
    for e in EV:
        t, ty = e["t"], e["type"]
        near = np.sum(np.abs(dens_t - t) < 0.25) if len(dens_t) else 1
        g = 0.55 / np.sqrt(max(1.0, near / 3))
        if ty == "tick": put(FX, tick_alu(0.9), t, g * (0.75 + 0.25 * rng.random()), 0.2)
        elif ty == "tok": put(FX, tok_acr(1.0), t, g * 1.2, -0.2)
        elif ty == "brass":
            h = max(0, int(e.get("h", 1)) - 1)
            put(FX, glock(mi(PENTA[h % len(PENTA)]), 0.35, 0.9), t, 0.32, 0.25)
            put(FX, tick_alu(0.8), t, g)
        elif ty == "riffle":
            n = int(e["n"])
            for k in range(n): put(FX, tick_alu(0.6) if k % 3 else tok_acr(0.6), t - 0.3 + 0.5 * ((k + 1) / n) ** 0.85, 0.12, rng.uniform(-0.6, 0.6))
        elif ty == "lift": put(FX, air(0.9, 0.5, 300, 2200), t, 0.35)
        elif ty == "impact":
            put(FX, knock_wood(1.0), t, 0.7)
            for k in range(3): put(FX, knock_wood(0.4 / (k + 1)), t + 0.08 + k * 0.06, 0.4)
    # первая пластина крупно — отдельный звонкий тик
    put(FX, tick_alu(1.0), 4.55, 0.6, 0.1)
    put(FX, knock_wood(0.5), T["end"], 0.5)

def bed():
    n = rng.standard_normal((N, 2))
    x = lpf(hpf(n, 120), 1800) * 0.012
    BED[:] += x

def suck(buf, a, b, depth_db=-30, ramp=0.06):
    g = np.ones(N); s, e = int(a * SR), int(b * SR); r = int(ramp * SR)
    lvl = 10 ** (depth_db / 20)
    g[s:s + r] = np.linspace(1, lvl, r); g[s + r:e - r] = lvl; g[e - r:e] = np.linspace(lvl, 1, r)
    buf *= g[:, None]

score(); foley(); bed()
for buf in (MUS, PUL, FX):
    suck(buf, T["suck1"], T["lift"]); suck(buf, T["suck2"], T["end"])
# баланс: музыка и пульс тише, фоли поверх, удары громче всего
mix = MUS * 0.9 + PUL * 0.55 + FX * 1.0 + HIT * 1.1 + BED
mix = hpf(mix, 32, 2)
# плавное затухание в конце
f = np.ones(N); fs, fe = int((DUR - 2.0) * SR), int(DUR * SR)
f[fs:fe] = np.linspace(1, 0, fe - fs) ** 1.5; f[fe:] = 0
mix *= f[:, None]
mix = mix[: int(DUR * SR)]
# громкость: RMS активной части к −15 dBFS, затем лимитер с упреждением 5 мс, потолок −2.4 dBFS
from scipy.ndimage import maximum_filter1d, uniform_filter1d
act = mix[int(4 * SR): int(52 * SR)]
rms = np.sqrt(np.mean(act ** 2)); mix *= 10 ** (-15 / 20) / rms
CEIL = 10 ** (-2.4 / 20); la = int(0.005 * SR)
pk = maximum_filter1d(np.max(np.abs(mix), 1), size=2 * la + 1)
gr = np.minimum(1.0, CEIL / np.maximum(pk, 1e-9))
gr = np.minimum(gr, uniform_filter1d(gr, size=la))           # мягкая атака
rel = np.exp(-1 / (0.08 * SR)); g2 = np.empty_like(gr); cur = 1.0
for i in range(len(gr)):
    cur = gr[i] if gr[i] < cur else cur * rel + (1 - rel) * gr[i]
    g2[i] = cur
mix *= g2[:, None]
mix = np.clip(mix, -CEIL, CEIL)
os.makedirs(os.path.join(HERE, "out"), exist_ok=True)
sf.write(os.path.join(HERE, "out/mix.wav"), mix.astype(np.float32), SR, subtype="PCM_24")
print("mix.wav", mix.shape[0] / SR, "s")
