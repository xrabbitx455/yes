# ToonFlow

An integrated, self-hosted 2D animation series studio. The home screen is a film library; the Studio is the script, scene, animation, and rendering workspace.

## Run

From `/workspace/yes`:

```sh
node studio/server.cjs
```

The server uses port **3000**. `PORT` and `HOST` can be set for your deployment. The default host is `127.0.0.1`. Open the running website in your browser and create your own account. The first registered account is the studio owner and can upload the official ToonFlow logo through **Profile → Upload the official ToonFlow logo**.

The website is running in this workspace; it has not been deployed to a public domain. Its Publish buttons create public watch pages on the running website. Those links can be shared when the website is hosted at an accessible address.

For a public Railway deployment, see [DEPLOY.md](DEPLOY.md). It uses the root Dockerfile, a persistent `/data` volume, and a private first-owner setup key. Public hosting requires your hosting account and a generated domain.

## Included workflows

- Account signup/login, password hashing with scrypt, HttpOnly sessions, agreement acceptance and separate account ownership.
- Ten-question onboarding from the supplied questionnaire, one question per screen; Back, optional Skip, multiple choices for questions 4/5, and write-ins for Other. Answers save to the creator profile. The final answer routes to the selected first-run workspace.
- A home library with folders, rename controls, nested playlists, favorites, profiles, and Create in Studio. The top-left logo returns home.
- Separate **date created** and **date published**. Film publication requires genre and theme. Published films and playlists have public watch pages; playlists only publish when their included films are published.
- Scene, cast, dialogue, location, camera, pose, keyframe, vehicle and effect editing. Character sheets and background references can be uploaded, with an explicit action to use an image as the scene background.
- Script-to-scenes and natural-language direction through the server-side Codex CLI bridge. Model output uses a constrained project schema and is validated before saving. Conflicting manual edits are preserved and require applying the returned draft.
- Python/NumPy original sound design and meSpeak synthetic draft dialogue. With `ELEVENLABS_API_KEY` set privately on the server, the Audio panel loads ElevenLabs account voices, searches the community library, assigns voices per character, and caches generated dialogue clips for previews and exports. The key is never sent to the browser. Preview audio is generated from the same project snapshot used for final export.
- The Audio panel links to Pixabay Music. Download a track from Pixabay, then upload the WAV/MP3 with its source page URL. ToonFlow saves the music with the project, loops it across the episode, and lets you adjust volume. Pixabay music browsing and downloading happen on Pixabay because its public API does not supply this workflow.
- Chromium renders deterministic Canvas frames; FFmpeg produces H.264/AAC MP4. Downloads support 240p, 360p, 480p, 720p, 1080p, 1440p, and 4K. Higher resolution usually takes longer and produces a larger file; actual size is reported on completion.
- Completed-film download variants can be resized to another resolution. Resizing does not add original detail. For native 4K, select 4K before rendering in Studio.
- Activity & progress lists each profile's Codex, audio, render and conversion jobs. Frame rendering has measured progress; model thinking uses an indeterminate meter rather than claiming a known completion percentage.

## Data and backups

`studio/data/toonflow.sqlite` is the persistent SQLite database, using WAL mode. It stores accounts, password hashes, hashed sessions, questionnaire answers, profiles, projects, folder/playlist membership, publication metadata, uploaded-file ownership, and job progress. JSON project/job copies are recoverable working snapshots; the database is the primary store. Uploads and encoded media are retained as files under `studio/data`.

Back up the complete `studio/data` directory, including SQLite files and media, with the server stopped for a simple consistent backup. Data and installed packages are Git-ignored. Set `STUDIO_DATA_DIR` to use a different persistent directory. Project edits save automatically; render jobs preserve an immutable project snapshot. A process restart marks interrupted jobs failed instead of claiming they completed.

## Installation

Required tools: Node.js **22.13+** (this environment uses 24), Python 3 with NumPy, Chromium, and FFmpeg/libx264/AAC. Node tool dependencies are frozen in lockfiles:

```sh
npm --cache /tmp/toonflow-npm --prefix tools ci --ignore-scripts --no-audit --no-fund
npm --cache /tmp/toonflow-npm --prefix studio/runtime ci --ignore-scripts --no-audit --no-fund
```

Set `CHROMIUM_PATH` for a different Chromium executable. Set `CODEX_BIN` to choose your installed Codex CLI. The bundled official CLI 0.104.0 uses the direct execution architecture; it avoids an in-process startup write that newer CLIs require in this cloud machine's read-only Codex home. SQLite/log runtime paths are redirected through supported CLI configuration to the studio data directory. Existing authentication is reused; credentials are never copied into project files or exposed to the browser.

On a separate server, authenticate its Codex CLI using `codex login`. The service uses that server-side Codex account, not each ToonFlow password. Multiple ToonFlow profiles remain separate, while AI usage is billed to the configured server's provider account.

## Current cloud connection

The editor, account library, database, audio, frame renderer, MP4 exporter and download variants were executed and verified in this machine. A real Codex direction was attempted. Both **chatgpt.com** and **auth.openai.com** are now reachable. The latest real request failed with: “Your access token could not be refreshed. Please log out and sign in again.” Live model-generated edits still require fresh server-side Codex authentication. Sign in securely on the server using the configured Codex CLI; do not put credentials in chat or project files. The UI checks required destinations and surfaces authentication failures.

A draft adds `chatgpt.com` and `auth.openai.com` to the environment's custom allowed domains while preserving package-manager presets, and saves the tested installation script and startup instructions. Review and save these changes in environment settings, then publish the environment. A draft save does not itself apply runtime network access. Retry a Codex direction after network access and server authentication are available. The UI reports the blocked connection instead of displaying a fabricated model reply.

## Validation

```sh
node studio/scripts/test.cjs
# After server-side Codex login and allowed service access:
TEST_CODEX=1 node studio/scripts/test.cjs
```

Tests create a separate temporary data directory. The report is `studio/test-report.json`. Browser checks cover signup/agreement, onboarding, folders and playlists, publication metadata, profile edits, account isolation, animation controls, persistent edits, Pixabay-source music, preview sound, real MP4 generation, 240p/4K conversions, activity, and mobile layout. A mocked ElevenLabs API test covers catalog lookup, community voice import, synthesis, and cache reuse without spending API credits. Generated videos are probed and fully decoded. No zero-test or simulated render is counted as a passing video check.

## Production scope

The current renderer provides reusable 2D military stick figure assets and pose/keyframe animation. The questionnaire collects interest in other styles; it does not claim an implemented 3D or anime renderer. Synthetic voices and procedural artwork are draft assets. The reference photos supplied inline in chat are not automatically imported as files; the library accepts their original PNG/JPEG/WebP files.

The supplied ToonFlow logo was visible in chat but its source file was not exposed to this workspace. The current header uses an orange/blue ToonFlow wordmark until the owner uploads the original artwork. The upload preserves the exact image bytes rather than recreating the logo.

The User Agreement is a draft for this early release, not a jurisdiction-specific legal review. No marketing consent is inferred from signup or questionnaire answers. No email delivery, password recovery, payment processing, or public hosting service is configured.
