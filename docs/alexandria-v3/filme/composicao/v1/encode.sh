#!/bin/sh
# encode.sh <kbps-video>  — entregas a partir de master.mp4
set -e
F="$(dirname "$0")"; cd "$F"
OUT=/c/dev/gridalpha-v2-alexandria-v3/public/alexandria/v3/home/filme
K=${1:-1150}
mkdir -p enc
# H.264 dois passos, sem áudio, faststart, compatível com qualquer navegador
ffmpeg -loglevel error -y -i master.mp4 -an -c:v libx264 -preset veryslow -tune film -profile:v high -level 4.1 \
  -pix_fmt yuv420p -b:v ${K}k -maxrate $((K*2))k -bufsize $((K*4))k -g 96 -pass 1 -passlogfile enc/x264 -f mp4 NUL
ffmpeg -loglevel error -y -i master.mp4 -an -c:v libx264 -preset veryslow -tune film -profile:v high -level 4.1 \
  -pix_fmt yuv420p -b:v ${K}k -maxrate $((K*2))k -bufsize $((K*4))k -g 96 -pass 2 -passlogfile enc/x264 \
  -movflags +faststart -metadata title="Alexandria — apresentação" "$OUT/alexandria-apresentacao.mp4"
# VP9 dois passos
ffmpeg -loglevel error -y -i master.mp4 -an -c:v libvpx-vp9 -b:v ${K}k -row-mt 1 -tile-columns 2 -g 96 -deadline good -cpu-used 1 -pass 1 -passlogfile enc/vp9 -f webm NUL
ffmpeg -loglevel error -y -i master.mp4 -an -c:v libvpx-vp9 -b:v ${K}k -row-mt 1 -tile-columns 2 -g 96 -deadline good -cpu-used 1 -pass 2 -passlogfile enc/vp9 \
  -metadata title="Alexandria — apresentação" "$OUT/alexandria-apresentacao.webm"
ls -la "$OUT"
