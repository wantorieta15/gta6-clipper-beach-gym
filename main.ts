// gta6-clipper-01 entry: render a vertical GTA 6 Short from Trailer 2.
//
// The clip is one contiguous moment from Rockstar's Grand Theft Auto VI
// Trailer 2 (trailer seconds 35-46: driving through Vice City, then the
// beach muscle gym where a guy bench-presses on the sand), cut vertical
// for YouTube Shorts, with a spoken + on-screen pitch for make.fun and an
// end card carrying the bounty page and the entrant's play code.
//
// Inputs (in MAKEFUN_BOT_DIR, default /bot): source.mp4 (the trailer),
// narration.wav (the spoken pitch), VIDEO.json (the video's address).
// Outputs (in MAKEFUN_OUTPUT_DIR, default /output): clip.mp4 (the Short,
// 1080x1920, 28 seconds) and VIDEO.json (copied through unchanged).
//
// Node 22+, standard library only, no network. Rendering is done by
// ffmpeg, which the competition lists as a requirement. Run locally with:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

const SOURCE = 'source.mp4';
const NARRATION = 'narration.wav';
const VIDEO_JSON = 'VIDEO.json';
const CLIP = 'clip.mp4';

// The moment, in trailer seconds: a single contiguous range, played in
// order, no reordering. The bench press lands about 3 seconds in, which
// is the hook the on-screen text points at.
const MOMENT_START = 35;
const MOMENT_END = 46;
const MOMENT_SECONDS = MOMENT_END - MOMENT_START;

// The pitch starts when the moment ends. The narration runs 8.688 s, so
// the pitch section is 9 s and the end card holds the remaining 8 s.
const PITCH_START = MOMENT_SECONDS;
const PITCH_SECONDS = 9;
const END_SECONDS = 8;
const TOTAL_SECONDS = MOMENT_SECONDS + PITCH_SECONDS + END_SECONDS;

// Vertical Shorts frame. The trailer is 1280x720, so the 9:16 window is
// 405 px wide; it is taken from the centre, where the bench press and
// the truck both sit, then scaled up.
const CROP_W = 405;
const CROP_H = 720;
const CROP_X = 437;
const OUT_W = 1080;
const OUT_H = 1920;
const FPS = 30;

const FONT = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf';
// The play code is one of this bounty's four codes for account 1,
// fetched from GET /api/competitions/gta6-clipper-01/play-code: code 0.
// Any of the four passes the gate; code 0 is the one the kit reports.
// (The code named in the original brief belongs to another bounty and
// is NOT one of this bounty's four — it would not pass this gate.)
const PLAY_CODE = 'makefun-dairy-peach-field';

// On-screen text. Colons and commas are left out of every line on
// purpose: ffmpeg's filter parser treats them as separators, and the
// lines read fine without them. Every line sits inside the Shorts safe
// area: clear of the top bar and of the buttons at the bottom right.
type TextCue = { text: string; from: number; to: number; size: number; y: number };

const TEXT_CUES: TextCue[] = [
  { text: 'POV - THE GYM IN GTA 6', from: 0, to: 6, size: 68, y: 180 },
  { text: 'ONLY IN LEONIDA', from: 6, to: 11, size: 60, y: 180 },
  { text: 'MY AI AGENT MADE THIS CLIP', from: 11, to: 15, size: 56, y: 820 },
  { text: 'EARN MONEY MAKING CLIPS', from: 15, to: 19.7, size: 56, y: 760 },
  { text: 'LIKE IT ON make.fun', from: 15, to: 19.7, size: 56, y: 860 },
  { text: 'make.fun', from: 20, to: 28, size: 110, y: 620 },
  { text: 'make.fun/bounty/gta6-clipper-01', from: 20, to: 28, size: 40, y: 860 },
  { text: 'play code - ' + PLAY_CODE, from: 20, to: 28, size: 34, y: 960 },
];

function drawtext(cue: TextCue): string {
  return (
    `drawtext=fontfile=${FONT}:text='${cue.text}'` +
    `:fontsize=${cue.size}:fontcolor=white` +
    `:box=1:boxcolor=black@0.55:boxborderw=20` +
    `:x=(w-text_w)/2:y=${cue.y}` +
    `:enable='between(t,${cue.from},${cue.to})'`
  );
}

function buildVideoFilter(): string {
  const moment =
    `[0:v]trim=start=${MOMENT_START}:end=${MOMENT_END},setpts=PTS-STARTPTS,` +
    `crop=${CROP_W}:${CROP_H}:${CROP_X}:0,scale=${OUT_W}:${OUT_H}:flags=lanczos,` +
    `setsar=1,fps=${FPS},split=2[moment][freezeSrc]`;
  // The pitch plays over the bench-press frame, held still and dimmed
  // so the spoken pitch and its text stay readable.
  const freeze =
    `[freezeSrc]trim=start=4:end=5,` +
    `setpts=PTS-STARTPTS,loop=loop=-1:size=${FPS}:start=0,setpts=N/${FPS}/TB,` +
    `trim=start=0:end=${PITCH_SECONDS},setpts=PTS-STARTPTS,setsar=1,` +
    `drawbox=x=0:y=0:w=${OUT_W}:h=${OUT_H}:color=black@0.45:t=fill[pitchbg]`;
  const endcard =
    `color=c=0x0b1020:s=${OUT_W}x${OUT_H}:r=${FPS}:d=${END_SECONDS},setsar=1[endbg]`;
  const joined =
    `[moment][pitchbg][endbg]concat=n=3:v=1:a=0,` +
    TEXT_CUES.map(drawtext).join(',') +
    `[vout]`;
  return [moment, freeze, endcard, joined].join(';');
}

function buildAudioFilter(): string {
  // The trailer's own audio runs under the moment at full volume, then
  // drops to a quiet bed while the narration speaks, and stays quiet
  // under the end card. The 11 s of trailer audio loops under the bed
  // (11 s x 44100 Hz = 485100 samples a loop). The narration starts
  // exactly at the pitch. The mix does not divide by its input count,
  // so the narration keeps its own level.
  const bed =
    `[0:a]atrim=start=${MOMENT_START}:end=${MOMENT_END},asetpts=PTS-STARTPTS,` +
    `aloop=loop=-1:size=485100,atrim=start=0:end=${TOTAL_SECONDS},` +
    `volume='if(lt(t,${PITCH_START}),1.0,0.20)':eval=frame[bed]`;
  const voice =
    `[1:a]adelay=${PITCH_START * 1000}|${PITCH_START * 1000},` +
    `apad,atrim=start=0:end=${TOTAL_SECONDS}[voice]`;
  const mixed = `[bed][voice]amix=inputs=2:duration=first:dropout_transition=0:normalize=0[aout]`;
  return [bed, voice, mixed].join(';');
}

function runChecked(tool: string, args: string[], label: string): void {
  const done = spawnSync(tool, args, { encoding: 'utf8' });
  if (done.error) {
    throw new Error(`${label} could not start ${tool}: ${(done.error as Error).message}`);
  }
  if (done.status !== 0) {
    const lines = String(done.stderr ?? '').trim().split('\n');
    const shown = lines.length > 40 ? lines.slice(0, 40).join('\n') : lines.join('\n');
    throw new Error(`${label} failed (${tool} exit ${done.status}):\n${shown}`);
  }
}

function renderClip(): void {
  const clipPath = join(OUTPUT_DIR, CLIP);
  const args = [
    '-y',
    '-i', join(BOT_DIR, SOURCE),
    '-i', join(BOT_DIR, NARRATION),
    '-filter_complex', buildVideoFilter() + ';' + buildAudioFilter(),
    '-map', '[vout]',
    '-map', '[aout]',
    '-c:v', 'libx264',
    '-preset', 'medium',
    '-crf', '20',
    '-pix_fmt', 'yuv420p',
    '-r', String(FPS),
    '-c:a', 'aac',
    '-b:a', '128k',
    '-movflags', '+faststart',
    '-t', String(TOTAL_SECONDS),
    clipPath,
  ];
  runChecked('ffmpeg', args, 'render');
  const probe = spawnSync(
    'ffprobe',
    ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', clipPath],
    { encoding: 'utf8' },
  );
  if (!probe.error && probe.status === 0) {
    const seconds = Number.parseFloat(String(probe.stdout).trim());
    if (Number.isFinite(seconds) && Math.abs(seconds - TOTAL_SECONDS) > 1) {
      throw new Error(`rendered clip is ${seconds}s, expected about ${TOTAL_SECONDS}s`);
    }
    console.log(`clip rendered: ${clipPath} (${seconds}s)`);
  } else {
    console.log(`clip rendered: ${clipPath} (duration check skipped: ffprobe unavailable)`);
  }
}

function publishVideoJson(): void {
  // The gate reads VIDEO.json from the output directory. It is passed
  // through byte for byte: whatever address the uploader put in is the
  // address the house reads.
  const text = readFileSync(join(BOT_DIR, VIDEO_JSON), 'utf8');
  const parsed = JSON.parse(text) as { url?: unknown };
  if (typeof parsed.url !== 'string' || parsed.url.length === 0) {
    throw new Error('VIDEO.json holds no url string');
  }
  writeFileSync(join(OUTPUT_DIR, VIDEO_JSON), text);
  console.log(`VIDEO.json published: ${parsed.url}`);
}

function main(): void {
  for (const name of [SOURCE, NARRATION, VIDEO_JSON]) {
    if (!existsSync(join(BOT_DIR, name))) {
      throw new Error(`missing input in ${BOT_DIR}: ${name}`);
    }
  }
  mkdirSync(OUTPUT_DIR, { recursive: true });
  renderClip();
  publishVideoJson();
  console.log(`done: ${TOTAL_SECONDS}s vertical clip + VIDEO.json in ${OUTPUT_DIR}`);
}

main();
