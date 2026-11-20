# HANDOFF — gta6-clipper-01 Akun 1 (@walta-exchange)

Klip + repo SELESAI. Belum di-submit, belum di-upload ke YouTube.
Tutup bounty: **23 Nov 2026 09:00 WITA**. Hasil: 7 Des 2026. Skor = views
YouTube, top 20 dibayar (1st $100, 2nd $70, 3rd $50).

## Klip

- File: `clip.mp4` di repo ini (10,6 MB) — juga di GitHub repo.
- 1080x1920, 30 fps, 28 detik, H.264 + AAC. ffprobe terverifikasi.
- Momen: GTA VI Trailer 2 resmi Rockstar, detik 35–46 (satu potongan
  utuh, berurutan): berkendara di Vice City → gym pantai, bench press
  "GAINZ" di pasir. Sudut ini belum ada di papan (dihindari: supercar
  pantai, chase 138–151 dtk, laut, truk pemadam, buaya, helikopter,
  Lucia bebas, jet, kereta, lompat motor, memancing).
- 0–11 dtk momen + teks "POV - THE GYM IN GTA 6" / "ONLY IN LEONIDA".
  11–20 dtk pitch: narasi TTS (Atlas, Inggris) "My AI agent made this
  clip from GTA 6. You can earn money making clips just like it, on
  make.fun." + teks di layar, di atas frame bench press yang dibekukan
  dan digelapkan. 20–28 dtk end card: make.fun + alamat bounty +
  play code. Audio trailer jadi bed pelan di bawah narasi dan end card.
- Papan saat studi (20 Nov 12:19): 429 entri, #1 = 1.325 views,
  garis bayar #20 ≈ 462 views.

## Repo

- https://github.com/wantorieta15/gta6-clipper-beach-gym
- Commit final: (diisi setelah HANDOFF ini di-commit — lihat `git log`)
- Anchor: 047d1210702bad03a3c124f57f1dc2a397fc3ba7, drand 34115258,
  wallet Hqgq1zDiVXvdwpqaNTGcFMCByWFdrNRkuR5Shb1CxbHZ (Akun 1, benar).
- `main.ts` ditulis dari nol di sesi builder ini (7 pesan tulis/edit),
  render pipeline ffmpeg. `VIDEO.json` masih placeholder — isi setelah
  upload (lihat bawah).
- Kit check pada bundle uji: SEMUA gate lolos KECUALI `thinking_priced`
  (0 usage rows — sesi builder masih jalan saat bundle uji dibuat;
  usage rows baru muncul di muse.db setelah sesi ini selesai).
  `thinking_reproduces` 182/185 = 98,3% authored.
- TIDAK ADA recording ID: bounty ini bundle-flow, BUKAN strict-
  transcript — `makefun record` ditolak HTTP 400 ("does not take
  recorded transcripts"). Submit nanti pakai bundle.

## Judul YouTube yang diusulkan

`POV: The Gym in GTA 6`

Alternatif: `POV: You Hit the Gym in GTA 6`

## Deskripsi YouTube — siap tempel (jangan ubah baris bounty)

```
POV: the gym in GTA 6 hits different. My AI agent made this clip from GTA 6 — and you can earn money making clips just like it, on make.fun.

Made by my AI agent for a $500 bounty on make.fun, where you can earn money making clips with AI: https://make.fun/bounty/gta6-clipper-01

makefun-dairy-peach-field
```

Baris kedua adalah baris bounty verbatim dari RULES.txt (wajib ada:
"$500 bounty" + make.fun + play code). Play code di baris sendiri.

## Play code — PENTING, BACA INI

Play code yang dipakai klip ini dan deskripsi di atas:
**`makefun-dairy-peach-field`** (code 0 dari 4 kode bounty ini untuk
Akun 1, dari GET /api/competitions/gta6-clipper-01/play-code).
Tiga kode lain yang juga lolos gate: `makefun-summit-applause-tandem`,
`makefun-signpost-flipper-beanie`, `makefun-pavilion-arena-echo`.

JANGAN pakai `makefun-quail-clipper-pancake` — itu kode bounty LAIN
(meme-x), bukan salah satu dari 4 kode bounty ini, dan TIDAK akan
lolos gate. End card klip sudah diperbaiki ke dairy-peach-field
(commit 3e5ac46).

## Langkah upload untuk mas Wan

Channel SUDAH JADI: **"Walta Exchange" — @WaltaExchange-b3e**.
Tidak perlu buat channel baru.

1. Terima file `clip.mp4` dari Walta (atau unduh dari repo GitHub di
   atas — file `clip.mp4` di root repo).
2. Buka aplikasi YouTube di HP → tap tombol **+** (Create) → **Upload
   video** → pilih `clip.mp4`. Video vertikal 28 detik otomatis jadi
   Short.
3. Judul: tempel `POV: The Gym in GTA 6`.
4. Deskripsi: tempel SELURUH blok deskripsi di atas (termasuk baris
   bounty dan play code).
5. Visibilitas: **Public**. Publikasikan.
6. Salin URL videonya (Share → Copy link) dan kirim ke Walta.
7. Video WAJIB tetap Public sampai hasil keluar (7 Des 2026).
   Jangan di-private atau dihapus.
8. Alternatif (tidak wajib — deskripsi video sudah membawa play code):
   play code juga boleh ditaruh di deskripsi channel via YouTube Studio
   → Customization → Profile → Description → Publish.

## Catatan untuk parent (submit setelah URL didapat)

1. Edit `VIDEO.json` DI SESI PARENT (harus muncul di transkrip yang
   di-bundle!): `{"url": "<URL Shorts asli>"}`. Jangan mengarang URL.
2. Commit + push, catat SHA 40 karakter.
3. Bundle (resep yang sudah terbukti di bundle uji — file-file uji:
   `/tmp/clipper-test-bundle2.tar.gz`, `/tmp/clipper-parent-trimmed.jsonl`,
   `/tmp/clipper-prompt.txt`, `/tmp/clipper-system-prompt.txt`):
   - `--session` = sesi builder ini:
     `/home/hatch/agents/agent-5cbfc253-fd86-4b0f-8e74-b4c8a3ffd0f6/sessions/5cbfc253-fd86-4b0f-8e74-b4c8a3ffd0f6.jsonl`
   - `--parent-session` = parent session TER-TRIM: session_header +
     baris dari pesan mas Wan "bisa kan buat video clip buat gta6"
     sampai EOF (trim lama di /tmp/clipper-parent-trimmed.jsonl SUDAH
     basi — parent session terus bertambah; buat trim baru saat submit,
     pastikan < 64 MiB).
   - `--prompt-file` = file berisi persis `Ya, buatkan klipnya`
     (satu baris, kata-kata mas Wan verbatim).
   - `--prompt-origin handed-off --prompt-via "subagent task handed off by the main agent"`
   - `--muse-usage` = usage.jsonl dari muse.db untuk agent
     5cbfc253-fd86-4b0f-8e74-b4c8a3ffd0f6 (dan parent, bila perlu) —
     AMBIL SETELAH sesi builder ini selesai, karena saat bundle uji
     dibuat muse.db masih 0 rows dan `thinking_priced` gagal karenanya.
   - `--no-discover` WAJIB (tanpa itu, sesi koordinator + sesi utama
     ikut ter-bundle dan `thinking_in_window` gagal).
   - `--system-prompt` = ringkasan instruksi builder (ada di
     /tmp/clipper-system-prompt.txt). `--harness muse --harness-version
     "harness@4ba923d701f156ec6cb1ab4325f7321b931722d827b6c6d103885e14"
     --provider meta --model muse-spark-1.3 --effort default --mcp none`.
   - HOME asli saat bundle (supaya ~/AGENTS.md terlihat), kredensial
     Akun 1 tetap di env.
4. Kit check harus 0 fail sebelum submit. (Pada bundle uji: hanya
   `thinking_priced` yang fail; `repo_owner` / `source_bundle` /
   `duplicate_snapshot` adalah fase submission yang beres saat submit.)
5. Submit dari dalam kit yang sudah di-unpack, dengan keypair Akun 1:
   `node cli/makefun.mjs submit --competition gta6-clipper-01 --source
   <repo> --title "POV: The Gym in GTA 6" --keypair
   ~/.makefun/keypair.json` — lalu verifikasi stage `scored` via
   /api/agents/me dan laporkan ke mas Wan berlabel Akun 1.
   Kuota: maks 5 submit/hari, 10 total. Submit terakhir sebelum
   deadline adalah entri final.
6. Jangan submit video orang lain, jangan beli/bot views (diskualifikasi).
