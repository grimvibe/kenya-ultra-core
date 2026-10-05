// utils/ytdlp.js
// Wraps yt-dlp for two different consumers:
//
//   1. downloadAsMp3 / downloadAsMp4
//      -> used by routes/api/v1/ytmp3.js + ytmp4.js (the public API for
//         your 3 devs). Downloads to os.tmpdir(), the route streams it
//         back with res.download() and deletes it immediately after.
//
//   2. fetchAudioForBot / fetchVideoForBot
//      -> used by the bot commands (play, song, ytmp3, ytmp4 command
//         files). Core doesn't send raw files to the public bot repo —
//         it sends back a JSON reply with a URL, and the public bot
//         fetches that URL itself (same pattern as api/media.js's
//         /assets/uploads). So these save into assets/downloads/
//         (served statically) and return a public URL via assetUrl(),
//         with the file auto-deleted a few minutes later.
//
// Uses execFile (not exec) with an args array, so URLs can't break out
// into shell commands.

import { execFile } from "child_process";
import path from "path";
import fs from "fs";
import os from "os";
import crypto from "crypto";
import { assetUrl } from "./assetUrl.js";

const YOUTUBE_URL_REGEX = /^https?:\/\/(www\.)?(youtube\.com|youtu\.be|m\.youtube\.com)\/.+$/i;

const DOWNLOAD_DIR = path.join(process.cwd(), "assets", "downloads");
const BOT_FILE_TTL_MS = 10 * 60 * 1000; // 10 minutes — plenty of time for the public bot to fetch it

// YouTube blocks/challenges requests from datacenter IPs (Cloud
// Run, AWS, etc.) with "Sign in to confirm you're not a bot" —
// confirmed 2026-08-11. Exporting cookies from a real, logged-in
// browser session and pointing yt-dlp at them is the standard
// workaround. Set YOUTUBE_COOKIES_B64 in Cloud Run's env vars
// (base64 of a Netscape-format cookies.txt) — written to disk
// below on startup. If missing, yt-dlp just runs without it (and
// will likely keep hitting the bot-check).
// NOTE: cookies expire/rotate — if this starts failing again
// after previously working, re-export a fresh cookies.txt.
const COOKIES_PATH = path.join(process.cwd(), "config", "cookies.txt");

function cookieArgs() {
    return fs.existsSync(COOKIES_PATH)
        ? ["--cookies", COOKIES_PATH]
        : [];
}

if (process.env.YOUTUBE_COOKIES_B64) {

    try {

        fs.mkdirSync(path.dirname(COOKIES_PATH), { recursive: true });

        fs.writeFileSync(
            COOKIES_PATH,
            Buffer.from(process.env.YOUTUBE_COOKIES_B64, "base64")
        );

        console.log("[ytdlp] Loaded YouTube cookies from YOUTUBE_COOKIES_B64.");

    } catch (err) {

        console.error("[ytdlp] Failed to write cookies from YOUTUBE_COOKIES_B64:", err.message);

    }

}

if (!fs.existsSync(DOWNLOAD_DIR)) {
    fs.mkdirSync(DOWNLOAD_DIR, { recursive: true });
}

export function isValidYoutubeUrl(url) {
    return typeof url === "string" && YOUTUBE_URL_REGEX.test(url.trim());
}

function makeId() {
    return crypto.randomBytes(8).toString("hex");
}

function runYtDlp(args) {

    return new Promise((resolve, reject) => {

        execFile(
            "yt-dlp",
            args,
            { timeout: 55000, maxBuffer: 1024 * 1024 * 20 },
            (err, stdout, stderr) => {

                if (err) {
                    return reject(new Error(stderr || err.message));
                }

                resolve(stdout);

            }
        );

    });

}

function scheduleCleanup(filePath, delayMs) {
    setTimeout(() => fs.unlink(filePath, () => {}), delayMs);
}

// ==========================
// For the public /api/v1 endpoints (streamed + deleted immediately)
// ==========================

export async function downloadAsMp3(url) {

    if (!isValidYoutubeUrl(url)) throw new Error("Invalid YouTube URL");

    const outPath = path.join(os.tmpdir(), `yt-${makeId()}.mp3`);

    await runYtDlp([
        url,
        "-x",
        "--audio-format", "mp3",
        "--audio-quality", "0",
        "-o", outPath,
        "--no-playlist",
        ...cookieArgs()
    ]);

    if (!fs.existsSync(outPath)) throw new Error("Conversion failed - no output file produced");

    return outPath;

}

export async function downloadAsMp4(url) {

    if (!isValidYoutubeUrl(url)) throw new Error("Invalid YouTube URL");

    const outPath = path.join(os.tmpdir(), `yt-${makeId()}.mp4`);

    await runYtDlp([
        url,
        "-f", "bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best",
        "--merge-output-format", "mp4",
        "-o", outPath,
        "--no-playlist",
        ...cookieArgs()
    ]);

    if (!fs.existsSync(outPath)) throw new Error("Conversion failed - no output file produced");

    return outPath;

}

export function cleanupFile(filePath) {
    fs.unlink(filePath, () => {});
}

// ==========================
// For bot commands (public URL + metadata, auto-expires)
// ==========================

export async function fetchAudioForBot(url) {

    if (!isValidYoutubeUrl(url)) throw new Error("Invalid YouTube URL");

    const filename = `yt-${makeId()}.mp3`;
    const outPath = path.join(DOWNLOAD_DIR, filename);

    const stdout = await runYtDlp([
        url,
        "-x",
        "--audio-format", "mp3",
        "--audio-quality", "0",
        "-o", outPath,
        "--no-playlist",
        ...cookieArgs(),
        "--print", "after_move:%(title)s|||%(duration)s"
    ]);

    if (!fs.existsSync(outPath)) throw new Error("Conversion failed - no output file produced");

    const [title, durationSeconds] = stdout.trim().split("|||");

    scheduleCleanup(outPath, BOT_FILE_TTL_MS);

    return {
        downloadUrl: assetUrl(`downloads/${filename}`),
        title: title || "Audio",
        duration: formatDuration(durationSeconds)
    };

}

export async function fetchVideoForBot(url) {

    if (!isValidYoutubeUrl(url)) throw new Error("Invalid YouTube URL");

    const filename = `yt-${makeId()}.mp4`;
    const outPath = path.join(DOWNLOAD_DIR, filename);

    const stdout = await runYtDlp([
        url,
        "-f", "bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best",
        "--merge-output-format", "mp4",
        "-o", outPath,
        "--no-playlist",
        ...cookieArgs(),
        "--print", "after_move:%(title)s|||%(duration)s"
    ]);

    if (!fs.existsSync(outPath)) throw new Error("Conversion failed - no output file produced");

    const [title, durationSeconds] = stdout.trim().split("|||");

    scheduleCleanup(outPath, BOT_FILE_TTL_MS);

    return {
        downloadUrl: assetUrl(`downloads/${filename}`),
        title: title || "Video",
        duration: formatDuration(durationSeconds)
    };

}

function formatDuration(seconds) {

    const s = Number(seconds);

    if (!s || Number.isNaN(s)) return undefined;

    const mins = Math.floor(s / 60);
    const secs = Math.floor(s % 60);

    return `${mins}:${String(secs).padStart(2, "0")}`;

}
