import BK9 from "../../utils/bk9.js";
import Vreden from "../../utils/vreden.js";
import Downloader from "../../utils/downloader.js";
import MaxxTech from "../../utils/maxxtech.js";
import Prexzy from "../../utils/prexzy.js";
import Reply from "../../utils/reply.js";
import { fetchAudioForBot } from "../../utils/ytdlp.js";

export default {

    name: "ytmp3",
    description: "Download YouTube audio.",
    category: "Download",
    usage: ".ytmp3 <youtube-link>",

    async execute(message) {

        if (!message.args?.length) {

            return Reply.error(
`Please provide a YouTube link.

Example:
.ytmp3 https://youtu.be/dQw4w9WgXcQ`
            );

        }

        const url = message.args[0];

        const videoIdMatch = url.match(
            /(?:v=|youtu\.be\/|shorts\/)([a-zA-Z0-9_-]{11})/
        );

        const fallbackThumbnail = videoIdMatch
            ? `https://i.ytimg.com/vi/${videoIdMatch[1]}/hqdefault.jpg`
            : undefined;

        // ==========================
        // Primary — @vreden/youtube_scraper (free). Tried first per
        // request; rehosted through Core the same way BK9 is, since
        // its download link is also IP-locked.
        // ==========================

        try {

            const result = await Vreden.ytmp3(url);

            return Reply.download({
                mediaType: "audio",
                url: result.downloadUrl,
                title: result.title,
                thumbnail: result.thumbnail || fallbackThumbnail,
                duration: result.duration || "Unknown",
                size: result.size || "Unknown",
                source: "YouTube",
                fileName: `${result.title}.mp3`,
                mimetype: "audio/mpeg"
            });

        } catch (vredenErr) {

            console.error("ytmp3 Vreden source failed:", vredenErr.message);

        }

        // ==========================
        // Fallback #0 — self-hosted (yt-dlp on Core itself). Free, but
        // needs a valid config/cookies.txt to get past YouTube's
        // bot-check from a datacenter IP — see utils/ytdlp.js.
        // ==========================

        try {

            const result = await fetchAudioForBot(url);

            return Reply.download({
                mediaType: "audio",
                url: result.downloadUrl,
                title: result.title,
                thumbnail: fallbackThumbnail,
                duration: result.duration || "Unknown",
                size: "Unknown",
                source: "YouTube",
                fileName: `${result.title}.mp3`,
                mimetype: "audio/mpeg"
            });

        } catch (primaryErr) {

            console.error("ytmp3 self-hosted source failed:", primaryErr.message);

        }

        // ==========================
        // Fallback #1 — BK9 (free). Core downloads the file itself
        // and re-serves it from Core's own domain (see utils/bk9.js)
        // instead of handing the client BK9's raw googlevideo link
        // — this avoids the IP-lock problem for free, likely because
        // Cloud Run <-> googlevideo is Google-to-Google traffic.
        // ==========================

        try {

            const result = await BK9.ytmp3(url);

            return Reply.download({
                mediaType: "audio",
                url: result.downloadUrl,
                title: result.title,
                thumbnail: result.thumbnail || fallbackThumbnail,
                duration: result.duration || "Unknown",
                size: "Unknown",
                source: "YouTube (fallback)",
                fileName: `${result.title}.mp3`,
                mimetype: "audio/mpeg"
            });

        } catch (fbBk9Err) {

            console.error("ytmp3 BK9 fallback failed:", fbBk9Err.message);

        }

        // ==========================
        // Fallback #2 — cod3uchiha (paid). Costs money per request,
        // so this only runs when both free sources above fail.
        // Confirmed working 2026-08-09: genuinely proxied through
        // their own domain, ~470KB/sec.
        // ==========================

        try {

            const result = await Downloader.ytmp3(url);

            return Reply.download({
                mediaType: "audio",
                url: result.downloadUrl,
                title: result.title,
                thumbnail: result.thumbnail || fallbackThumbnail,
                duration: result.duration || "Unknown",
                size: result.size || "Unknown",
                source: "YouTube (fallback)",
                fileName: `${result.title}.mp3`,
                mimetype: "audio/mpeg"
            });

        } catch (fb0Err) {

            console.error("ytmp3 cod3uchiha fallback failed:", fb0Err.message);

        }

        // ==========================
        // Fallback #3 (MaxxTech) — free, rehosted through Core via
        // BK9.rehost() (same trick as the BK9 tier above) instead of
        // handing the client a raw googlevideo link directly.
        // ==========================

        try {

            const fb = await MaxxTech.youtube(url, "mp3");
            const best = fb.formats?.[0];

            if (!best) {
                throw new Error("No audio formats returned.");
            }

            const hostedUrl = await BK9.rehost(best.url, best.ext || "m4a");

            return Reply.download({
                mediaType: "audio",
                url: hostedUrl,
                title: fb.title,
                thumbnail: fb.thumbnail,
                duration:
                    fb.duration ? `${Math.floor(fb.duration / 60)}:${String(fb.duration % 60).padStart(2, "0")}` : "Unknown",
                size: best.size_human || "Unknown",
                source: "YouTube (fallback)",
                fileName: `${fb.title}.${best.ext || "m4a"}`,
                mimetype: best.mime || "audio/mp4"
            });

        } catch (fb1Err) {

            console.error("ytmp3 MaxxTech fallback failed:", fb1Err.message);

        }

        // ==========================
        // Fallback #4 (Prexzy) — same rehosting approach.
        // ==========================

        try {

            const fb2 = await Prexzy.ytmp3(url);

            const hostedUrl = await BK9.rehost(fb2.download_url, fb2.ext || "m4a");

            return Reply.download({
                mediaType: "audio",
                url: hostedUrl,
                title: fb2.info?.title,
                thumbnail: fb2.info?.thumbnail,
                duration: fb2.info?.duration_string || "Unknown",
                size: fb2.filesize
                    ? `${(fb2.filesize / (1024 * 1024)).toFixed(1)}MB`
                    : "Unknown",
                source: "YouTube (fallback)",
                fileName: `${fb2.info?.title || "audio"}.${fb2.ext || "m4a"}`,
                mimetype: "audio/mp4"
            });

        } catch (fb2Err) {

            console.error("ytmp3 Prexzy fallback failed:", fb2Err.message);

            return Reply.error(
                "Failed to download audio from all available sources. Please try again later."
            );

        }

    }

};
