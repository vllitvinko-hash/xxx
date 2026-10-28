"""Write out/caligula.srt from the voice-over timeline (for the 16:9 block)."""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
timeline = json.loads((ROOT / "src" / "Caligula" / "timeline.json").read_text())


def ts(t):
    ms = round(t * 1000)
    return f"{ms // 3600000:02d}:{ms // 60000 % 60:02d}:{ms // 1000 % 60:02d},{ms % 1000:03d}"


lines = [l for s in timeline["scenes"] for l in s["lines"]]
out = []
for i, l in enumerate(lines, 1):
    end = min(l["end"] + 0.5, lines[i]["start"]) if i < len(lines) else l["end"] + 0.8
    out.append(f"{i}\n{ts(l['start'])} --> {ts(end)}\n{l['text']}\n")
(ROOT / "out").mkdir(exist_ok=True)
(ROOT / "out" / "caligula.srt").write_text("\n".join(out), encoding="utf-8")
print("out/caligula.srt")
