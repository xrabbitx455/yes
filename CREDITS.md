# Production tools

Animation, story assembly, rigs, artwork, and procedural sound design are implemented in this repository. Story and dialogue are supplied by the user in `supplied-outline.md`.

- HTML Canvas and JavaScript: drawing and animation.
- Chromium and Playwright: browser rendering and validation.
- FFmpeg: H.264/AAC video encoding and media checks.
- Python and NumPy: original procedural audio and mixing.
- [meSpeak](https://github.com/mikolalysenko/mespeak), version 2.0.2: synthetic draft speech, based on eSpeak. The package is GPL-licensed; its source and documentation are in `tools/node_modules/mespeak` after installation. No speech tool source is bundled into the browser player.

No stock music, sound libraries, external images, or recorded actors are used. Draft voices are synthetic and do not impersonate a particular person.
