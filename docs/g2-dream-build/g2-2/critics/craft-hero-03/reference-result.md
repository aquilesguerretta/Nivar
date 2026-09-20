# External playback result

- **CRED: accepted complete playback.** Fresh live media from the requested 60fps.design page reached 7.550 / 7.550 seconds at playback rate 1, without seeking. The captured sequence was inspected. The review's CRED persistence/material comparison is supported by this playback.
- **MUST: full fresh playback not achieved.** Attempt 1 reached 1.236 / 12.417 seconds and stalled through a 65.8-second capture. Attempt 2 used a separate native video element, preload, and a source cache buster. It started at 0, rate 1, with no seeking, but repeatedly entered `waiting` and only reached 0.247 seconds in 39.3 seconds. Neither attempt reached `ended`.
- I do not claim to have watched the complete fresh MUST interaction. The earlier allowed external `must-motion` images can describe visual states, but they were not used to stand in for a successful motion test. The craft bar and NIVAR verdict were not relaxed because of this playback limitation.

Evidence: `cred-playback.json`, `cred-contact-00.jpg` through `cred-contact-02.jpg`, `must-playback.json`, `must-buffered-playback.json`, and the corresponding native screenshots under `captures/`.
