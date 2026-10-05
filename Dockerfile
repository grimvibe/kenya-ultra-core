FROM node:20-slim

WORKDIR /app

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        fonts-dejavu-core \
        ffmpeg \
        python3 \
        python3-pip \
        curl \
        unzip && \
    pip3 install --no-cache-dir --break-system-packages yt-dlp && \
    apt-get purge -y python3-pip && \
    rm -rf /var/lib/apt/lists/*

# Deno is required by yt-dlp to solve YouTube's signature (nsig/sig) challenges.
# Without it, yt-dlp logs "Signature solving failed" and formats may be missing/blocked.
RUN curl -fsSL https://deno.land/install.sh | sh
ENV DENO_INSTALL="/root/.deno"
ENV PATH="${DENO_INSTALL}/bin:${PATH}"

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8080

ENV PORT=8080

CMD ["npm", "start"]
