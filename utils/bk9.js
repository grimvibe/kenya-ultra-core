// utils/bk9.js
// Free, unauthenticated wrapper around api.bk9.dev.
//
// IMPORTANT: BK9's returned downloadUrl is a signed Google CDN link
// bound to the IP that requested it — that's Core (Cloud Run). Your
// public bot repo runs on a different server (Pterodactyl) and fetches
// media itself to send via Baileys, so handing it BK9's raw URL causes
// Google to 403 (IP mismatch), even though the link is "valid."
//
// Fix: Core downloads the file immediately (same IP that BK9 signed
// the URL for), saves it into assets/downloads/ (served statically,
// same pattern as assets/uploads/), and returns a Core-hosted URL
// instead. The public bot then fetches from Core, not from Google —
// no IP-lock issue. File auto-deletes after 10 minutes.

import axios from "axios";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { assetUrl } from "./assetUrl.js";

const BASE = "https://api.bk9.dev/download";
const DOWNLOAD_DIR = path.join(process.cwd(), "assets", "downloads");
const FILE_TTL_MS = 10 * 60 * 1000;

if (!fs.existsSync(DOWNLOAD_DIR)) {
    fs.mkdirSync(DOWNLOAD_DIR, { recursive: true });
}

function makeId() {
    return crypto.randomBytes(8).toString("hex");
}

function scheduleCleanup(filePath, delayMs) {
    setTimeout(() => fs.unlink(filePath, () => {}), delayMs);
}

async function rehost(remoteUrl, ext) {

    const filename = `bk9-${makeId()}.${ext}`;
    const outPath = path.join(DOWNLOAD_DIR, filename);

    const response = await axios.get(remoteUrl, {
        responseType: "stream",
        timeout: 60000,
        headers: {
            "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36"
        }
    });

    await new Promise((resolve, reject) => {

        const writer = fs.createWriteStream(outPath);

        response.data.pipe(writer);

        writer.on("finish", resolve);
        writer.on("error", reject);

    });

    scheduleCleanup(outPath, FILE_TTL_MS);

    return assetUrl(`downloads/${filename}`);

}

async function ytmp3(url) {

    if (!url) throw new Error("URL is required.");

    const { data } = await axios.get(`${BASE}/ytmp3`, {
        params: { url, type: "mp3" },
        timeout: 30000
    });

    if (!data.status || !data.BK9?.downloadUrl) {
        throw new Error("BK9 ytmp3 failed.");
    }

    const ext = data.BK9.format || "m4a";
    const hostedUrl = await rehost(data.BK9.downloadUrl, ext);

    return {
        downloadUrl: hostedUrl,
        title: data.BK9.title,
        duration: data.BK9.duration
            ? `${Math.floor(data.BK9.duration / 60)}:${String(data.BK9.duration % 60).padStart(2, "0")}`
            : undefined,
        thumbnail: data.BK9.image
    };

}

async function ytmp4(url, quality = "720p") {

    if (!url) throw new Error("URL is required.");

    const { data } = await axios.get(`${BASE}/youtube`, {
        params: { url, quality, type: "video" },
        timeout: 30000
    });

    if (!data.status || !data.BK9?.url) {
        throw new Error("BK9 youtube (video) failed.");
    }

    const hostedUrl = await rehost(data.BK9.url, "mp4");

    return {
        downloadUrl: hostedUrl,
        title: data.BK9.filename?.replace(/\.mp4$/i, ""),
        size: data.BK9.size
    };

}

export default { ytmp3, ytmp4, rehost };
