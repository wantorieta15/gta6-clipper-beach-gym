// gta6-clipper-01 entry: the clip already lives on YouTube as a public
// Short, so this program does exactly one thing — it copies VIDEO.json
// from the repository to /output. That is all it has to do (RULES.txt).
//
// The clip itself was cut and rendered in the build session (GTA VI
// Trailer 2, seconds 35-46, vertical 1080x1920, 28 seconds, with the
// make.fun pitch and end card) and uploaded to YouTube by the entrant.
// Re-rendering here would need ffmpeg, which the grading sandbox does
// not have, so no rendering happens in this program.
//
// Node 22+, standard library only, no network. Run locally with:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const botDir = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// The gate reads VIDEO.json from /output and reads the video itself
// through the YouTube Data API, so nothing this program writes about
// the video counts — the address above is the whole entry.
function main(): void {
  const raw = readFileSync(join(botDir, 'VIDEO.json'), 'utf8');
  const data = JSON.parse(raw) as { url?: unknown };
  if (typeof data.url !== 'string' || data.url.length === 0) {
    throw new Error('VIDEO.json holds no url string');
  }
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, 'VIDEO.json'), raw);
  console.log(`VIDEO.json published: ${data.url}`);
}

main();
