# Copper motion · G2.3 review

Recommendation: usable as an **illustrative Hardware material study**, played once with an explicit replay control. It is not a seamless loop and it is not documentation of a real installation. This is a coordinating asset recommendation, not owner approval.

## What was inspected

- Native Higgsfield single-job preview was opened for the actual completed job `5e1eeae5-970f-40d9-93eb-913cb6b66777`.
- `contact-sheet-24.jpg` shows 24 frames at quarter-second intervals, ordered left to right and top to bottom. The first row starts at 0 seconds; each row spans approximately one second.
- `endpoints-0-3-6s.jpg` shows decoded frames 0, 72 and 144 at 960 px, at 0, 3 and 6 seconds.
- Both sheets were visually inspected against the existing source `docs/g2-dream-build/g2-1/media/sources/7-copper-connection.png`.
- The complete optimized stream decoded successfully; all 145 frames were compared numerically for temporal discontinuities. This metric supports the frame review; it cannot prove physical accuracy or exclude every transient local artifact. Native continuous playback was displayed, but the model-visible visual review is the extracted frames rather than a claimed human playback review.

## Observations

The bolt head, washer, doubled joint edge and graphite enclosure retain continuity across the inspected frames. The camera travels slowly across the copper: the joint moves from the right of the composition toward the centre, while focus leaves the grain on the left and settles on the joint. The source image is a 4:3 composition; the generated 16:9 film reframes that subject. No new device, spark, light pulse, LED, lettering or hand appears in the inspected frames. No visible liquid-metal effect or geometry morph was found.

The ending differs substantially from the beginning. At 320×180 grayscale, adjacent-frame mean absolute differences averaged 2.085/255 (maximum 4.186); last-to-first difference is 41.111/255. More importantly, the endpoint sheet visibly shows different framing and focus. **Do not use `loop` for a hard reset.** Prefer one muted inline playback, pause when offscreen/hidden and an explicit replay action. Reduced motion or data saving should show the poster without requesting the video.

The film is appropriate to explain the physical contact before measurement. It does not establish measured performance, instrument calibration, real Brazilian fieldwork or a manufactured NIVAR product.

## Deliverables and validation

| File | Content |
| --- | --- |
| `copper-original.mp4` | Original generated HEVC, 1920×1080, 24 fps, 145 frames, 6.042 s, 1,658,346 B; no audio stream |
| `public/g2/g23/hardware/copper-motion-960.mp4` | H.264 High, 960×540, 24 fps, 145 frames, 6.042 s, 225,981 B; yuv420p, faststart, no audio |
| `public/g2/g23/hardware/copper-motion-poster.webp` | First frame of the optimized video, 960×540, WebP quality 90 |
| `review.html` | Local player, source comparison and extracted frame sheets |
| `manifest.json` | Source/model/job IDs, prompt, pipeline and SHA-256 |

Processing used the Higgsfield sandbox's ffmpeg/ffprobe and Pillow. The derivative only resizes and re-encodes; it retains all source frames and original timing. No retiming, crossfade, reverse-loop, added graphic, new generation or runtime integration was performed in this workstream. Source and derivatives were exported from the sandbox before it expired, then retained in the project.
