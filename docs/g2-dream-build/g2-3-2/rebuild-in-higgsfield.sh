#!/usr/bin/env bash
# Run inside the Higgsfield sandbox, from this source directory.
# Reserve output upload URLs first and append their PUT commands to the same
# sandbox call: /home/user is ephemeral. This script contains no upload secrets.
set -euo pipefail
mkdir -p /home/user/raw /home/user/exports
curl -fsSL 'https://d8j0ntlcm91z4.cloudfront.net/user_3F1DEoC9eFdV9QyJdtMMl8uGxwj/hf_20260913_023631_c090a89f-e447-4944-866b-c130c3df80c2.mp4' -o '/home/user/raw/hefesto.mp4'
curl -fsSL 'https://d8j0ntlcm91z4.cloudfront.net/user_3F1DEoC9eFdV9QyJdtMMl8uGxwj/hf_20260913_024557_3b4172b7-5b54-4412-b976-eac96b03a068.mp4' -o '/home/user/raw/ariadne.mp4'
curl -fsSL 'https://d8j0ntlcm91z4.cloudfront.net/user_3F1DEoC9eFdV9QyJdtMMl8uGxwj/hf_20260913_024557_f1d29343-1d04-4e6d-b4ea-b70fbdb97fd2.mp4' -o '/home/user/raw/argos.mp4'
curl -fsSL 'https://d8j0ntlcm91z4.cloudfront.net/user_3F1DEoC9eFdV9QyJdtMMl8uGxwj/hf_20260913_024557_7f215f73-3a84-4148-a4df-ee0b179ae852.mp4' -o '/home/user/raw/socrates.mp4'
curl -fsSL 'https://d8j0ntlcm91z4.cloudfront.net/user_3F1DEoC9eFdV9QyJdtMMl8uGxwj/hf_20260913_024557_77dbd4a0-f034-4695-802e-3b1dad82ddd5.mp4' -o '/home/user/raw/perseu.mp4'
curl -fsSL 'https://d8j0ntlcm91z4.cloudfront.net/user_3F1DEoC9eFdV9QyJdtMMl8uGxwj/hf_20260913_025452_713869a6-8e41-400d-920d-fa18f08aeffc.mp4' -o '/home/user/raw/diogenes-walk.mp4'
curl -fsSL 'https://d8j0ntlcm91z4.cloudfront.net/user_3F1DEoC9eFdV9QyJdtMMl8uGxwj/hf_20260913_024557_5fe73a8e-41bd-4c33-97f3-312d500c25a1.mp4' -o '/home/user/raw/diogenes-face.mp4'
cp edit.mjs wordmark.svg /home/user/
convert -background none /home/user/wordmark.svg /home/user/wordmark.png
higgsedit build /home/user/edit.mjs
higgsedit check /home/user/nivar-edit
ffmpeg -hide_banner -loglevel warning -i /home/user/nivar-edit/renders/native-master.mp4 -c:v libx264 -preset slow -crf 21 -maxrate 5M -bufsize 10M -pix_fmt yuv420p -c:a aac -b:a 160k -af 'loudnorm=I=-18:TP=-1.5:LRA=10,afade=t=in:d=0.08,afade=t=out:st=32.5:d=1.04' -movflags +faststart -y /home/user/exports/nivar-energia-desktop.mp4
ffmpeg -hide_banner -loglevel warning -i /home/user/nivar-edit/renders/native-master.mp4 -vf "crop=1440:1080:x='if(lt(t,5.583333),240,if(lt(t,10.333333),280,if(lt(t,15.833333),0,if(lt(t,21.333333),240,if(lt(t,27.041666),140,if(lt(t,31.541666),240,if(lt(t,33.541666),240,240)))))))':y=0,scale=960:720:flags=lanczos,setsar=1" -c:v libx264 -preset slow -crf 22 -maxrate 2500k -bufsize 5M -pix_fmt yuv420p -c:a aac -b:a 128k -af 'loudnorm=I=-18:TP=-1.5:LRA=10,afade=t=in:d=0.08,afade=t=out:st=32.5:d=1.04' -movflags +faststart -y /home/user/exports/nivar-energia-mobile.mp4
for variant in desktop mobile; do
  poster=nivar-energia-poster; test "$variant" = desktop || poster=mobile-poster
  ffmpeg -hide_banner -loglevel error -ss 0.6 -i "/home/user/exports/nivar-energia-$variant.mp4" -frames:v 1 -quality 86 -y "/home/user/exports/$poster.webp"
done
