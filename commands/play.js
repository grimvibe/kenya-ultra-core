import axios from "axios";
import Downloader from "../../utils/downloader.js";
import BK9 from "../../utils/bk9.js";
import Vreden from "../../utils/vreden.js";
import MaxxTech from "../../utils/maxxtech.js";
import Prexzy from "../../utils/prexzy.js";
import Reply from "../../utils/reply.js";
import { fetchAudioForBot } from "../../utils/ytdlp.js";

export default {

    name: "play",
    aliases: ["song"],
    description: "Search YouTube and download audio.",
    category: "Download",
    usage: ".play <song name>",

    async execute(message) {

        if (!message.args.length) {

            return Reply.error(
`Please provide a song name.

Example:
.play Heat Waves`
            );

        }

        const query = message.args.join(" ");

        try {

            if (message.sock) {
                await message.sock.sendMessage(
                    message.chat,
                    { react: { text: "⏳", key: message.rawMessage.key } }
                );
            }

            const search = await Downloader.yts(query);

            if (!search.result.length) {
                return Reply.error("No results found.");
            }

            const video = search.result[0];

            if (message.sock) {

                await message.sock.sendMessage(
                    message.chat,
                    {
                        text:
`🎵 *Kenya-Ultra Downloader*

━━━━━━━━━━━━━━

📀 ${video.title}

👤 ${video.author.name}
⏱ ${video.duration}

⬇ Downloading audio...`,

                        contextInfo: {
                            externalAdReply: {
                                title: video.title,
                                body: `${video.author.name} • ${video.duration}`,
                                thumbnailUrl: video.thumbnail,
                                sourceUrl: video.url,
                                mediaType: 1,
                                renderLargerThumbnail: true,
                                showAdAttribution: false
                            }
                        }
                    }
                );

                await message.sock.sendMessage(
                    message.chat,
                    { react: { text: "⬇️", key: message.rawMessage.key } }
                );

            }

            // ==========================
            // Six-tier fallback chain:
            //   1. Vreden    (free, tried first — @vreden/youtube_scraper)
            //   2. Self-hosted (free, yt-dlp on Core — needs
            //      config/cookies.txt, see utils/ytdlp.js)
            //   3. BK9      (free, rehosted through Core — avoids
            //      the googlevideo IP-lock problem)
            //   4. cod3uchiha (paid safety net — genuinely proxied,
            //      confirmed working 2026-08-09)
            //   5. MaxxTech (free, now also rehosted through Core)
            //   6. Prexzy   (free, same rehosting)
            // ==========================

            let audio;

            try {

                const v = await Vreden.ytmp3(video.url);
                audio = { downloadUrl: v.downloadUrl, title: v.title || video.title };

            } catch (vredenErr) {

                console.error("play Vreden source failed:", vredenErr.message);

            try {

                const local = await fetchAudioForBot(video.url);
                audio = { downloadUrl: local.downloadUrl, title: local.title || video.title };

            } catch (selfHostedErr) {

                console.error("play self-hosted source failed:", selfHostedErr.message);

                try {

                    audio = await BK9.ytmp3(video.url);
                    audio.title = audio.title || video.title;

                } catch (primaryErr) {

                    console.error("play BK9 source failed:", primaryErr.message);

                    try {

                        const fb0 = await Downloader.ytmp3(video.url);

                        audio = { downloadUrl: fb0.downloadUrl, title: fb0.title || video.title };

                    } catch (fb0Err) {

                        console.error("play cod3uchiha fallback failed:", fb0Err.message);

                        try {

                            const fb = await MaxxTech.youtube(video.url, "mp3");
                            const best = fb.formats?.[0];

                            if (!best) throw new Error("No audio formats returned.");

                            const hostedUrl = await BK9.rehost(best.url, best.ext || "m4a");

                            audio = { downloadUrl: hostedUrl, title: fb.title || video.title };

                        } catch (fb1Err) {

                            console.error("play MaxxTech fallback failed:", fb1Err.message);

                            const fb2 = await Prexzy.ytmp3(video.url);

                            const hostedUrl2 = await BK9.rehost(fb2.download_url, fb2.ext || "m4a");

                            audio = { downloadUrl: hostedUrl2, title: fb2.info?.title || video.title };

                        }

                    }

                }

            }

            }

            let sizeLabel = "Unknown size";

            try {

                const head = await axios.head(audio.downloadUrl, { timeout: 15000 });
                const bytes = Number(head.headers["content-length"]);

                if (bytes) sizeLabel = `${(bytes / (1024 * 1024)).toFixed(1)}MB`;

            } catch {}

            if (message.sock) {
                await message.sock.sendMessage(
                    message.chat,
                    { react: { text: "✅", key: message.rawMessage.key } }
                );
            }

            return Reply.audio({

                url: audio.downloadUrl,
                fileName: `${audio.title}.mp3`,

                caption:
`🎵 *${audio.title}*

${video.author.name} | ⏱ ${video.duration} | ${sizeLabel} | Kenya-Ultra

🔗 youtube.com

━━━━━━━━━━━━━━

✅ Download Complete

🐺 Powered by Kenya-Ultra 👑`,

                contextInfo: {
                    externalAdReply: {
                        title: audio.title,
                        body: `${video.author.name} • ${video.duration} • ${sizeLabel} • Kenya-Ultra`,
                        thumbnailUrl: video.thumbnail,
                        sourceUrl: video.url,
                        mediaType: 1,
                        renderLargerThumbnail: true,
                        showAdAttribution: false
                    }
                },

                alsoDocument: true

            });

        } catch (err) {

            console.error(err);

            if (message.sock) {
                await message.sock.sendMessage(
                    message.chat,
                    { react: { text: "❌", key: message.rawMessage.key } }
                );
            }

            return Reply.error(err.message || "Failed to download audio.");

        }

    }

};
