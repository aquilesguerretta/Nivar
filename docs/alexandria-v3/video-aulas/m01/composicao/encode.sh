#!/bin/sh
# encode.sh <pasta-de-trabalho> <n...> — entregas a partir de <pasta>/masters/aula-0N.mp4
# (master do HyperFrames, 1920×1080, 30 fps, CRF 16, com a narração).
#   mp4  : H.264 high@4.1, CRF 20 com teto de 3,5 Mb/s, AAC mono 96 kb/s (loudnorm −16 LUFS), faststart  (meta ≤ 15 MB)
#   webm : VP9 CRF 31, Opus mono 64 kb/s
#   poster: quadro da cartela de abertura (título completo), WebP q86
set -e
W="$1"; shift
OUT=/c/dev/gridalpha-v2-alexandria-v3/public/alexandria/v3/aulas/m01/video
mkdir -p "$OUT"
for n in "$@"; do
  M="$W/masters/aula-0$n.mp4"
  ffmpeg -loglevel error -y -i "$M" -c:v libx264 -preset slow -profile:v high -level 4.1 -pix_fmt yuv420p \
    -crf 20 -maxrate 3500k -bufsize 7000k -g 60 -af loudnorm=I=-16:TP=-1.5:LRA=11 -ar 48000 -c:a aac -ac 1 -b:a 96k -movflags +faststart \
    -metadata title="Alexandria · M01 · Aula 0$n" -metadata language=por "$OUT/aula-0$n.mp4"
  ffmpeg -loglevel error -y -i "$M" -c:v libvpx-vp9 -crf 31 -b:v 0 -row-mt 1 -tile-columns 2 -cpu-used 2 -deadline good -g 60 \
    -af loudnorm=I=-16:TP=-1.5:LRA=11 -ar 48000 -c:a libopus -ac 1 -b:a 64k -metadata title="Alexandria · M01 · Aula 0$n" "$OUT/aula-0$n.webm"
  ffmpeg -loglevel error -y -ss 3.9 -i "$M" -frames:v 1 -c:v libwebp -quality 86 "$OUT/aula-0$n-poster.webp"
  ls -la "$OUT/aula-0$n.mp4" "$OUT/aula-0$n.webm" "$OUT/aula-0$n-poster.webp" | awk '{print $5, $9}'
done
