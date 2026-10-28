#!/usr/bin/env bash
# Render both clips, both covers and the subtitles into out/.
# Set REMOTION_BROWSER to a Chrome/Chromium headless shell if Remotion cannot download its own.
set -euo pipefail
cd "$(dirname "$0")/.."
browser=()
if [[ -n "${REMOTION_BROWSER:-}" ]]; then browser=(--browser-executable="$REMOTION_BROWSER"); fi
npx remotion render Caligula-16x9 out/caligula-16x9.mp4 --codec=h264 --crf=18 "${browser[@]}"
npx remotion render Caligula-9x16 out/caligula-9x16.mp4 --codec=h264 --crf=18 "${browser[@]}"
npx remotion still Cover-16x9 out/cover-16x9.png "${browser[@]}"
npx remotion still Cover-9x16 out/cover-9x16.png "${browser[@]}"
python3 scripts/srt.py
# Platforms normalize to about -14 LUFS but never boost quiet uploads.
for f in out/caligula-16x9.mp4 out/caligula-9x16.mp4; do
  ffmpeg -y -loglevel error -i "$f" -c:v copy -af loudnorm=I=-14:TP=-1.5:LRA=11 -ar 48000 -c:a aac -b:a 192k "${f%.mp4}.tmp.mp4"
  mv "${f%.mp4}.tmp.mp4" "$f"
done
