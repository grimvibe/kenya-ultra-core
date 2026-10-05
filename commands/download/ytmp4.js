import BK9 from "../../utils/bk9.js";
import Vreden from "../../utils/vreden.js";
import Downloader from "../../utils/downloader.js";
import MaxxTech from "../../utils/maxxtech.js";
import Reply from "../../utils/reply.js";
import { fetchVideoForBot } from "../../utils/ytdlp.js";

export default {

    name: "ytmp4",
    description: "Download YouTube video.",
    category: "Download",
    usage: ".ytmp4 <youtube-link>",

    async execute(message) {

        if (!message.args?.length) {

            return Reply.error(
`Please provide a YouTube link.

Example:
.ytmp4 https://youtu.be/dQw4w9WgXcQ`
            );

        }

        const url = message.args[0];

        try {

            // ==========================
            // Five-tier fallback chain: Vreden (free, tried first) ->
            // self-hosted (free) -> BK9 (free, rehosted) -> cod3uchiha
            // (paid safety net) -> MaxxTech (free, now also rehosted).
            // ==========================

            let result;

            try {

                result = await Vreden.ytmp4(url, "720p");

            } catch (vredenErr) {

                console.error("ytmp4 Vreden source failed:", vredenErr.message);

                try {

                result = await fetchVideoForBot(url);

            } catch (selfHostedErr) {

                console.error("ytmp4 self-hosted source failed:", selfHostedErr.message);

                try {

                    result = await BK9.ytmp4(url, "720p");

                } catch (primaryErr) {

                    console.error("ytmp4 BK9 source failed:", primaryErr.message);

                    try {

                        result = await Downloader.ytmp4(url);

                    } catch (fb0Err) {

                        console.error("ytmp4 cod3uchiha fallback failed:", fb0Err.message);

                        const fb = await MaxxTech.youtube(url, "mp4");
                        const best = fb.formats?.[0];

                        if (!best) throw new Error("No video formats returned.");

                        const hostedUrl = await BK9.rehost(best.url, best.ext || "mp4");

                        result = {
                            downloadUrl: hostedUrl,
                            title: fb.title,
                            thumbnail: fb.thumbnail,
                            duration:
                                fb.duration
                                    ? `${Math.floor(fb.duration / 60)}:${String(fb.duration % 60).padStart(2, "0")}`
                                    : undefined,
                            size: best.size_human
                        };

                    }

                }

                }

            }

            return Reply.download({

                mediaType: "video",
                url: result.downloadUrl,
                title: result.title,
                thumbnail: result.thumbnail || "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
                duration: result.duration || "Unknown",
                size: result.size || "Unknown",
                source: "YouTube",
                fileName: `${result.title}.mp4`,
                mimetype: "video/mp4"

            });

        } catch (err) {

            console.error(err);

            return Reply.error(err.message || "Failed to download video.");

        }

    }

};
