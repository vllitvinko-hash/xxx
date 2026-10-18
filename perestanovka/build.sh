#!/bin/sh
# Сборка «Перестановки» одной командой: события → картинка → звук → сведение → постер → .srt
set -e
HERE=$(cd "$(dirname "$0")" && pwd)
LIB=${LIB:-$HOME/lemo-opuscar}
export LIB
[ -f "$LIB/core/render/video.mjs" ] || { echo "set LIB to the library folder"; exit 1; }
cd "$LIB"
node core/render/events.mjs "$HERE" --size 1080x1920
node core/render/video.mjs "$HERE" --fps 24 --workers 3 --size 1080x1920 --q 'pr=1.35' --out "$HERE/out/video.mp4"
"$LIB/.venv/bin/python" -I "$HERE/mix.py"
# громкость уже −14 LUFS / TP ≤ −1.6 dBTP в mix.py; здесь только сведение
ffmpeg -y -loglevel error -i "$HERE/out/video.mp4" -i "$HERE/out/mix.wav" -map 0:v -map 1:a -c:v copy -c:a aac -b:a 256k -ar 48000 -shortest -movflags +faststart "$HERE/perestanovka.mp4"
node core/render/still.mjs "$HERE" 0 --size 1080x1920 --out "$HERE/out/poster"
cp "$HERE/out/poster/t_0.jpg" "$HERE/poster.jpg"
"$LIB/.venv/bin/python" core/render/srt.py "$HERE/out/cues.json" "$HERE/perestanovka.srt"
