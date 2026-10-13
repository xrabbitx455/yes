# RED vs. BLUE: FRONTLINES

Season 1, Episode 1: **First Contact**. A seven-minute, code-rendered military stick figure production draft based on `supplied-outline.md`.

The delivered MP4 is `exports/first-contact.mp4`: 1920 × 1080, 24 FPS, H.264 video and AAC audio. `exports/first-contact.srt` contains the exact supplied dialogue. The player in `index.html` includes sound, pause/replay, scrubbing, and chapter selection.

## Watch the player

From `/workspace/yes`, run:

```sh
node scripts/server.cjs
```

Open port 8000 in a browser on the same machine. Select **Sound on**, then **Play**. The player and rendered video use the same timeline, rigs, and audio. The first frame is black as requested; the picture fades in after the opening radio cue.

## Rebuild

Prerequisites: Node.js, Python 3 with NumPy, Chromium, and FFmpeg with libx264/AAC. This cloud machine provides these. The Node tools are pinned in `tools/package-lock.json`.

```sh
npm --cache /tmp/frontlines-npm --prefix tools ci --ignore-scripts --no-audit --no-fund
node scripts/generate-voices.cjs
python3 scripts/soundtrack.py
node scripts/check.cjs
node scripts/render.cjs
```

Set `CHROMIUM_PATH` if Chromium is installed at another path. The renderer streams 10,080 deterministic frames into FFmpeg rather than storing a large frame sequence. Rendering writes a temporary MP4 and renames it only after successful encoding; progress is recorded in `exports/render-progress.json`.

## Direct future revisions

- `episode.js`: named cast, weapons, shot boundaries, and verbatim dialogue.
- `animation.js`: reusable skeletons with shared proportions, character poses, vehicles, environments, camera movements, and combat effects.
- `scripts/generate-voices.cjs`: distinct synthetic scratch voices.
- `scripts/soundtrack.py`: original procedural wind, birds, engines, footsteps, weapon effects, radio static, rotors, and musical cues.
- `shot-list.md`: complete timecoded shot list.
- `supplied-outline.md`: the complete source script, preserved for reference.

## Story continuity

Mason leads four Blue soldiers; Hayes carries the radio and is wounded in the upper arm; Jackson carries the M249; Reed treats Hayes. Three Red soldiers appear, one is wounded, and the patrol withdraws without being pursued. The first shot is represented by an unassigned gunshot and a concrete impact, with no visible shooter. The armored column appears only in the final reveal. Contact with Command is restored before the warning about approaching armor. The final title card extends the supplied 06:55 scene ending to 07:00.

## Production status

This is a complete first animation pass with synthetic voices and synthesized sound, rather than final recorded performances. Some fast dialogue is fitted to the script's short time windows; `exports/audio-report.json` identifies those cues. Environment and equipment drawings are stylized approximations. Animation uses reusable poses and cycles; the storyboard can be refined into more detailed acting and effects without changing the script.

Browser validation exercises representative frames across all shots, deterministic rendering, cast equipment, play/pause/restart, seeking, and audio. `exports/validation.json` records the results. Final media metadata is recorded in `exports/media-report.json` after rendering.

## ToonFlow website

The integrated series studio, account-based library, onboarding, and MP4 pipeline are in [studio/README.md](studio/README.md). Run `node studio/server.cjs` from this repository to start ToonFlow on port 3000. The original episode player remains available through its original server script.
# Public hosting

The Railway deployment instructions for ToonFlow are in [studio/DEPLOY.md](studio/DEPLOY.md). The website currently runs in this workspace; no public domain has been issued.

