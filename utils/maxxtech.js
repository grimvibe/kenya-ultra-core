import axios from "axios";

const BASE = "https://api.maxxtech.co.ke";

const KEY =
    process.env.MAXXTECH_API_KEY ||
    "carlymaxx";

async function request(path, params = {}) {

    try {

        const { data } = await axios.get(
            `${BASE}${path}`,
            {
                params: {
                    ...params,
                    apikey: KEY
                },
                timeout: 30000
            }
        );

        if (!data.success) {
            throw new Error(data.message || "Request failed.");
        }

        return data.data;

    } catch (err) {

        throw new Error(
            err.response?.data?.message ||
            err.message ||
            "MaxxTech API request failed."
        );

    }

}

// =========================
// YouTube downloader (audio or video)
// =========================
// https://api.maxxtech.co.ke/downloader?url=...&format=mp3|mp4&apikey=...
//
// NOTE: the endpoint is "/downloader" with a "format" param — NOT
// "/maxxtech" with a "type" param (that older path silently ignored
// the requested type and always returned video). Confirmed working
// 2026-08-09.
//
// Response data shape:
// {
//   platform, type, video_id, source_url, title, thumbnail,
//   duration, uploader, channel_url, note,
//   formats: [ { quality, ext, mime, size, size_human, url } ]
// }
// formats[] is pre-sorted best-quality first for the requested format.

async function youtube(url, format = "mp3") {

    return await request(
        "/downloader",
        { url, format }
    );

}

// =========================
// YouTube audio — PROXIED STREAM URL
// =========================
// https://api.maxxtech.co.ke/ytmp3v2?url=...&bitrate=128&stream=true&apikey=...
//
// CRITICAL: use this (not formats[].url from youtube() above) for
// any audio actually being sent to WhatsApp/Baileys. The googlevideo.com
// links in youtube()'s formats[] are signed to MaxxTech's own outbound
// IP — a request from anywhere else (e.g. your bot's server) gets
// rejected by Google's CDN ("Failed to fetch stream"). With
// stream=true this endpoint itself IS the audio (served from
// api.maxxtech.co.ke, not googlevideo.com), so it's fetchable from
// any server. Confirmed working 2026-08-09.
//
// This just builds the URL — no network call, no metadata (title/
// thumbnail/duration). Pair with youtube() above, or an existing
// title you already have (e.g. from a prior yt search), for that.

function streamUrl(url, bitrate = 128) {

    const params = new URLSearchParams({
        url,
        bitrate,
        stream: "true",
        apikey: KEY
    });

    return `${BASE}/ytmp3v2?${params.toString()}`;

}

export default { request, youtube, streamUrl };
