import Downloader from "../../utils/downloader.js";
import BK9 from "../../utils/bk9.js";
import Vreden from "../../utils/vreden.js";
import MaxxTech from "../../utils/maxxtech.js";
import Prexzy from "../../utils/prexzy.js";
import Reply from "../../utils/reply.js";
import { fetchAudioForBot } from "../../utils/ytdlp.js";

export default {

    name: "song",
    description: "Search YouTube and download a song by name (no link needed).",
    category: "Download",
    usage: ".song <song name>",

    async execute(message) {

        if (!message.args?.length) {

            return Reply.error(
`Please provide a song name to search for.

Example:
.song Ed Sheeran Shape of You`
            );

        }

        const query = message.args.join(" ");

        try {

            const search = await Downloader.yts(query);
            const top = search.result?.[0];

            if (!top) {
                return Reply.error(`Couldn't find anything for "${query}".`);
            }

            // ==========================
            // Six-tier fallback chain: Vreden (free, tried first) ->
            // self-hosted (free) -> BK9 (free, rehosted) -> cod3uchiha
            // (paid safety net) -> MaxxTech (free, rehosted) -> Prexzy
            // (free, rehosted).
            // ==========================

            let result;

            try {

                const v = await Vreden.ytmp3(top.url);

                result = {
                    downloadUrl: v.downloadUrl,
                    title: v.title || top.title,
                    thumbnail: v.thumbnail || top.thumbnail,
                    duration: v.duration || top.duration,
                    size: v.size
                };

            } catch (vredenErr) {

                console.error("song Vreden source failed:", vredenErr.message);

            try {

                const local = await fetchAudioForBot(top.url);

                result = {
                    downloadUrl: local.downloadUrl,
                    title: local.title || top.title,
                    thumbnail: top.thumbnail,
                    duration: local.duration || top.duration
                };

            } catch (selfHostedErr) {

                console.error("song self-hosted source failed:", selfHostedErr.message);

                try {

                    const bk9 = await BK9.ytmp3(top.url);

                    result = {
                        downloadUrl: bk9.downloadUrl,
                        title: bk9.title || top.title,
                        thumbnail: bk9.thumbnail || top.thumbnail,
                        duration: bk9.duration || top.duration
                    };

                } catch (primaryErr) {

                    console.error("song BK9 source failed:", primaryErr.message);

                    try {

                        const fb0 = await Downloader.ytmp3(top.url);

                        result = {
                            downloadUrl: fb0.downloadUrl,
                            title: fb0.title || top.title,
                            thumbnail: fb0.thumbnail || top.thumbnail,
                            duration: fb0.duration || top.duration,
                            size: fb0.size
                        };

                    } catch (fb0Err) {

                        console.error("song cod3uchiha fallback failed:", fb0Err.message);

                        try {

                            const fb = await MaxxTech.youtube(top.url, "mp3");
                            const best = fb.formats?.[0];

                            if (!best) throw new Error("No audio formats returned.");

                            const hostedUrl = await BK9.rehost(best.url, best.ext || "m4a");

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

                        } catch (fb1Err) {

                            console.error("song MaxxTech fallback failed:", fb1Err.message);

                            const fb2 = await Prexzy.ytmp3(top.url);

                            const hostedUrl2 = await BK9.rehost(fb2.download_url, fb2.ext || "m4a");

                            result = {
                                downloadUrl: hostedUrl2,
                                title: fb2.info?.title,
                                thumbnail: fb2.info?.thumbnail,
                                duration: fb2.info?.duration_string,
                                size: fb2.filesize
                                    ? `${(fb2.filesize / (1024 * 1024)).toFixed(1)}MB`
                                    : undefined
                            };

                        }

                    }

                }

            }

            }

            return Reply.download({

                mediaType: "audio",
                url: result.downloadUrl,
                title: result.title || top.title,

                thumbnail:
                    result.thumbnail ||
                    top.thumbnail ||
                    "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg",

                duration: result.duration || top.duration || "Unknown",
                size: result.size || "Unknown",
                source: "YouTube",
                fileName: `${result.title || top.title}.mp3`,
                mimetype: "audio/mpeg"

            });

        } catch (err) {

            return Reply.error(err.message || `Failed to find/download "${query}".`);

        }

    }

};
