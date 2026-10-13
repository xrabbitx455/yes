FROM node:24-bookworm-slim

RUN apt-get update \
    && apt-get install -y --no-install-recommends ca-certificates chromium ffmpeg python3 python3-numpy \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY tools/package.json tools/package-lock.json ./tools/
COPY studio/runtime/package.json studio/runtime/package-lock.json ./studio/runtime/
RUN npm --prefix tools ci --ignore-scripts --no-audit --no-fund \
    && npm --prefix studio/runtime ci --ignore-scripts --no-audit --no-fund

COPY . .
RUN mkdir -p /data && chown -R node:node /app /data

ENV NODE_ENV=production HOST=0.0.0.0 PORT=3000 STUDIO_DATA_DIR=/data
USER node
EXPOSE 3000
CMD ["node", "studio/server.cjs"]
