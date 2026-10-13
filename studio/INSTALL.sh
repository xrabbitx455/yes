#!/usr/bin/env bash
set -euo pipefail
cd /workspace/yes
npm --cache /tmp/toonflow-npm --prefix tools ci --ignore-scripts --no-audit --no-fund
npm --cache /tmp/toonflow-npm --prefix studio/runtime ci --ignore-scripts --no-audit --no-fund
node -e "require('node:sqlite'); console.log('Node SQLite ready')"
python3 -c 'import numpy; print("Python audio dependencies ready")'
ffmpeg -version >/dev/null
chromium --version >/dev/null
node --check studio/server.cjs
node --check studio/public/app.js
node --check studio/public/home.js
