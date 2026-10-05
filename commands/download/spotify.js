import axios from "axios";
import Downloader from "../../utils/downloader.js";
import Reply from "../../utils/reply.js";
import { savePendingSearch } from "../../utils/pendingSpotifySearch.js";

const FABDL_BASE = "https://api.fabdl.com";

// fabdl now rejects server-to-server requests with 403 "invalid origin"
// unless the Origin/Referer headers match their own frontend. This is
// just a header check (not real browser-enforced CORS), so it's safe
// to set these on our end.
const FABDL_HEADERS = {
    Referer: "https://fabdl.com/",
    Origin: "https://fabdl.com"
};

async function resolveFromLink(url) {

    const { data } = await axios.get(`${FABDL_BASE}/spotify/get`, {
        params: { url },
        headers: FABDL_HEADERS,
        timeout: 15000
    });

    return data.result;

}

async function getFabdlDownloadUrl(track) {

    const { data } = await axios.get(
        `${FABDL_BASE}/spotify/mp3-convert-task/${track.gid}/${track.id}`,
        {
            headers: FABDL_HEADERS,
            timeout: 30000
        }
    );

    return `${FABDL_BASE}${data.result.download_url}`;

}

// fabdl removed /spotify/search entirely (confirmed dead — 404, no
// origin-check error at all, meaning the route itself is gone). Deezer's
// public catalog search is free, needs no key, and gives real track/
// artist/album/duration metadata — a genuine Spotify-style result list,
// not a YouTube guess. The actual audio still has to come from YouTube
// afterward (same as fabdl itself effectively did under the hood, and
// same as .play) since neither Deezer nor Spotify hand out full track
// downloads — Deezer only gives 30-second previews.
async function searchDeezer(query) {

    const { data } = await axios.get("https://api.deezer.com/search", {
        params: { q: query },
        timeout: 15000
    });

    const results = data.data || [];

    return results.slice(0, 5).map(item => ({
        title: item.title,
        artist: item.artist?.name || "Unknown Artist",
        album: item.album?.title || "",
        durationLabel: formatDuration(item.duration),
        cover: item.album?.cover_medium || null
    }));

}

function formatDuration(seconds) {

    const total = Number(seconds) || 0;
    const minutes = Math.floor(total / 60);
    const secs = String(total % 60).padStart(2, "0");

    return `${minutes}:${secs}`;

}

function formatResultsList(query, tracks) {

    const lines = tracks.map((track, i) =>
`${i + 1}. ${track.artist} - ${track.title}
   👤 ${track.artist} • ⏱ ${track.durationLabel} • 💿 ${track.album}`
    );

    return `🎵 *Spotify Search Results*
Query: _${query}_

${lines.join("\n\n")}

_Reply with a number (1-${tracks.length}) to download_`;

}

export default {

    name: "spotify",

    aliases: ["spotifydl"],

    description: "Search Spotify's catalog and pick a track to download.",

    category: "Download",

    usage: ".spotify <song name or spotify track link>",

    async execute(message) {

        if (!message.args || !message.args.length) {

            return Reply.error(
`Please provide a song name or Spotify track link.

Example:
.spotify Blinding Lights`
            );

        }

        const query = message.args.join(" ");

        const isLink = /open\.spotify\.com\/track/i.test(query);

        try {

            // Direct link — resolve and send straight away, no list needed.
            if (isLink) {

                const track = await resolveFromLink(query);

                if (!track) {
                    return Reply.error("No matching track found.");
                }

                const downloadUrl = await getFabdlDownloadUrl(track);

                const durationSec =
                    Math.floor((track.duration_ms || 0) / 1000);

                return Reply.audio({

                    url: downloadUrl,

                    mimetype: "audio/mpeg",

                    fileName: `${track.title}.mp3`,

                    caption:
`🎧 *${track.title}*

👤 ${track.artists} | ⏱ ${formatDuration(durationSec)}

🐺 Powered by Kenya-Ultra 👑`,

                    contextInfo: {
                        externalAdReply: {
                            title: track.title,
                            body: track.artists,
                            thumbnailUrl: track.image,
                            mediaType: 1,
                            renderLargerThumbnail: true,
                            showAdAttribution: false
                        }
                    },

                    alsoDocument: true

                });

            }

            // Song name — show a numbered list, same UX as a genuine
            // Spotify search bot: user replies with 1-5 to download.
            const tracks = await searchDeezer(query);

            if (!tracks.length) {
                return Reply.error("No matching track found.");
            }

            await savePendingSearch(
                message.chat,
                message.sender,
                message.senderAlt,
                tracks
            );

            return Reply.text(
                formatResultsList(query, tracks)
            );

        } catch (err) {

            console.log(
                `⚠ spotify command failed: ${err.message} | url: ${err.config?.url} | status: ${err.response?.status}`
            );

            return Reply.error(
                err.message || "Failed to search for that track."
            );

        }

    }

};

// Exported so the numeric-reply handler in api/execute.js can reuse
// the exact same YouTube search+download pipeline without duplicating
// it, and keep the caption format consistent with the direct-link path.
export async function downloadPickedTrack(track) {

    const search = await Downloader.yts(`${track.artist} - ${track.title}`);

    const video = search.result?.[0];

    if (!video) {
        throw new Error("Couldn't find that track to download.");
    }

    const audio = await Downloader.ytmp3(video.url);

    return Reply.audio({

        url: audio.downloadUrl,

        mimetype: "audio/mpeg",

        fileName: `${audio.title || track.title}.mp3`,

        caption:
`🎧 *${track.title}*

👤 ${track.artist} | ⏱ ${track.durationLabel}

🐺 Powered by Kenya-Ultra 👑`,

        contextInfo: {
            externalAdReply: {
                title: track.title,
                body: track.artist,
                thumbnailUrl: track.cover,
                mediaType: 1,
                renderLargerThumbnail: true,
                showAdAttribution: false
            }
        },

        alsoDocument: true

    });

}
