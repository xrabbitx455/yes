# Hosting ToonFlow

Railway is a practical first host for this Node website because the same container can run the editor, Chromium, Python, and FFmpeg. Use one service instance and a persistent volume; the SQLite database and finished films share one data directory. Railway charges for usage and storage, so check its current prices before creating the service. Long or 4K renders need more memory and time than a small website.

1. Connect the ToonFlow repository to your Railway account and deploy from the root `Dockerfile`. The included `railway.json` selects that Dockerfile and checks `/api/branding` for health. The repository must contain the website source. The existing `studio/data` directory and login files must stay out of Git.
2. Add a Railway volume mounted at `/data`. This is where `STUDIO_DATA_DIR` points. Keep a backup of that whole volume; it includes accounts, films, projects, references, and SQLite WAL files. Keep the service at one replica because it uses one SQLite database and one render queue.
3. Set `TOONFLOW_SETUP_KEY` as a private Railway service variable to a long random value (at least 24 characters). The server refuses to start in production without it. The first creator enters this key during signup to claim the owner account. Keep the key in Railway settings, not in source code or chat. Later creators sign up normally.
4. Generate a public domain for the service in Railway after the health check passes. Railway supplies HTTPS at that domain. Sign up as the first creator using your setup key, complete the questionnaire, and upload the original ToonFlow logo through Profile.
5. The Codex director needs working server-side authentication separately. The login in this development environment failed to refresh its token, so a new host will not have model access until its Codex CLI is authenticated. Script editing, animation, sound, and MP4 rendering run independently of that connection.

The supplied seven-minute draft film appears in the first owner's library if `exports/first-contact.mp4` is part of the Docker build context. It is present in the downloadable ToonFlow package. If the Git repository omits that large generated file, the Frontlines project still appears and can be rendered on the hosted website.

For an owner-managed server, the same `Dockerfile` can run behind an HTTPS proxy with a persistent `/data` volume. A static site host cannot run this app's account database and video rendering pipeline.
