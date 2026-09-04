FROM node:20-bookworm

WORKDIR /app

# Sistem bagimliliklari (Replit'te hazir gelen paketlerin karsiligi)
#   libreoffice     -> libreoffice-convert (Office <-> PDF)
#   ffmpeg          -> video/ses araclari
#   python3         -> node-gyp (better-sqlite3 native derleme)
#   build-essential -> better-sqlite3 native derleme
# "python" symlink: yt-dlp-exec kaldirildi, symlink artik gerekli degil ama
# zararsiz oldugu ve node-gyp bazi ortamlarda "python" adini aradigi icin
# birakildi.
RUN apt-get update && apt-get install -y \
    libreoffice \
    ffmpeg \
    python3 \
    build-essential \
    && rm -rf /var/lib/apt/lists/* \
    && ln -sf /usr/bin/python3 /usr/bin/python

COPY package*.json ./

# ffmpeg-static kurulumda GitHub'dan ~80MB binary indiriyor ve bu indirme
# ECONNRESET / socket hang up ile patliyor. FFMPEG_BIN set edilince paket
# indirmeyi atlayip apt ile kurulan /usr/bin/ffmpeg'i kullaniyor.
ENV FFMPEG_BIN=/usr/bin/ffmpeg

# "npm ci" DEGIL "npm install": package-lock.json Windows'ta uretildigi icin
# optional bagimlilik bufferutil lock'a girmemis, npm ci EUSAGE ile reddediyor.
# --omit=optional da EKLEMEYIN: rollup/esbuild Linux binary'leri oradan geliyor.
RUN npm install --no-audit --no-fund

COPY . .

RUN npm run build

# NOT: script/build.ts cogu bagimliligi "external" isaretliyor.
# dist/index.cjs calisma aninda node_modules'e ihtiyac duyar - prune ETMEYIN.

ENV NODE_ENV=production

EXPOSE 5001

CMD ["node", "dist/index.cjs"]
