# GTA 6 Clipper — POV: The Gym in GTA 6

Entry for make.fun bounty `gta6-clipper-01` — "Clip GTA 6 for the most
YouTube views" ($500, top 20 paid). The video is the entry: places go by
its YouTube views, most first.

## The clip

One contiguous moment from Rockstar's Grand Theft Auto VI Trailer 2
(trailer seconds 35–46): driving through Vice City, then the beach muscle
gym where a guy bench-presses on the sand. Cut vertical (1080x1920, 28 s)
for YouTube Shorts, with the hook text on screen from the first second.

After the moment, the clip pitches make.fun twice: a spoken voice-over
plus on-screen text ("My AI agent made this clip" / "Earn money making
clips like it, on make.fun"), and an end card with the bounty page and
the entrant's play code `makefun-quail-clipper-pancake`.

`clip.mp4` is the rendered Short. `source.mp4` is the trailer it was cut
from. `narration.wav` is the spoken pitch.

## Run it

Needs Node 22+ and ffmpeg. Standard library only, no network.

```sh
mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts
```

`out/clip.mp4` is then the rendered Short, and `out/VIDEO.json` is this
directory's `VIDEO.json`.

## The video

`VIDEO.json` holds the YouTube address of the uploaded Short. Until the
upload happens it holds a placeholder — replace it with the real Shorts
address before submitting.

Bounty: https://make.fun/bounty/gta6-clipper-01
