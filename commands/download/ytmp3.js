import Downloader from "../../utils/downloader.js";
import MaxxTech from "../../utils/maxxtech.js";
import Reply from "../../utils/reply.js";

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

        // ==========================
        // Primary source
        // ==========================

        try {

            const result = await Downloader.ytmp3(url);

            return Reply.download({

                mediaType: "audio",

                url: result.downloadUrl,

                title: result.title,

                thumbnail:
                    result.thumbnail ||
                    "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg",

                duration:
                    result.duration || "Unknown",

                size:
                    result.size || "Unknown",

                source: "YouTube",

                fileName:
                    `${result.title}.mp3`,

                mimetype:
                    "audio/mpeg"

            });

        } catch (primaryErr) {

            console.error("ytmp3 primary source failed:", primaryErr.message);

            // ==========================
            // Fallback source (MaxxTech)
            // ==========================

            try {

                const fb = await MaxxTech.request(
                    "/maxxtech",
                    { url, type: "mp3" }
                );

                const best = fb.formats?.[0];

                if (!best) {
                    throw new Error("No audio formats returned.");
                }

                return Reply.download({

                    mediaType: "audio",

                    url: best.url,

                    title: fb.title,

                    thumbnail: fb.thumbnail,

                    duration:
                        fb.duration ? `${Math.floor(fb.duration / 60)}:${String(fb.duration % 60).padStart(2, "0")}` : "Unknown",

                    size: best.size_human || "Unknown",

                    source: "YouTube (fallback)",

                    fileName: `${fb.title}.${best.ext || "m4a"}`,

                    mimetype: best.mime || "audio/mp4"

                });

            } catch (fallbackErr) {

                console.error("ytmp3 fallback source failed:", fallbackErr.message);

                return Reply.error(
                    "Failed to download audio from all available sources. Please try again later."
                );

            }

        }

    }

};
