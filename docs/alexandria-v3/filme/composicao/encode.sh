#!/bin/sh
# encode3.sh — entregas com locução (master3.mp4 → public/.../filme)
set -e
F="$(dirname "$0")"; cd "$F"
OUT=/c/dev/gridalpha-v2-alexandria-v3/public/alexandria/v3/home/filme
K=${1:-940}
mkdir -p enc
ffmpeg -loglevel error -y -i master3.mp4 -vn -af "loudnorm=I=-16:TP=-1.5:LRA=11" -ac 1 -ar 48000 enc/voz-norm.wav
ffmpeg -loglevel error -y -i master3.mp4 -an -c:v libx264 -preset veryslow -tune film -profile:v high -level 4.1 -pix_fmt yuv420p -b:v ${K}k -maxrate $((K*2))k -bufsize $((K*4))k -g 96 -pass 1 -passlogfile enc/x264 -f mp4 NUL
ffmpeg -loglevel error -y -i master3.mp4 -i enc/voz-norm.wav -map 0:v -map 1:a -c:v libx264 -preset veryslow -tune film -profile:v high -level 4.1 -pix_fmt yuv420p -b:v ${K}k -maxrate $((K*2))k -bufsize $((K*4))k -g 96 -pass 2 -passlogfile enc/x264 -c:a aac -b:a 80k -movflags +faststart -metadata title="Alexandria — apresentação" "$OUT/alexandria-apresentacao.mp4"
ffmpeg -loglevel error -y -i master3.mp4 -an -c:v libvpx-vp9 -b:v ${K}k -row-mt 1 -tile-columns 2 -g 96 -deadline good -cpu-used 1 -pass 1 -passlogfile enc/vp9 -f webm NUL
ffmpeg -loglevel error -y -i master3.mp4 -i enc/voz-norm.wav -map 0:v -map 1:a -c:v libvpx-vp9 -b:v ${K}k -row-mt 1 -tile-columns 2 -g 96 -deadline good -cpu-used 1 -pass 2 -passlogfile enc/vp9 -c:a libopus -b:a 64k -metadata title="Alexandria — apresentação" "$OUT/alexandria-apresentacao.webm"
ls -la "$OUT"
