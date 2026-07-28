import axios from "axios";
import Downloader from "../../utils/downloader.js";
import Reply from "../../utils/reply.js";

export default {

    name: "sc",

    aliases: ["soundcloud"],

    description: "Search and download SoundCloud audio.",

    category: "Download",

    usage: ".sc <song name>",

    async execute(message) {

        if (!message.args || !message.args.length) {

            return Reply.error(
`Please provide a search term.

Example:
.sc Heat Waves`
            );

        }

        const query = message.args.join(" ");

        try {

            const results = await Downloader.scSearch(query);

            const first = results[0];

            const data = await Downloader.soundcloud(first.permalink_url);

            const durationSec = Math.floor((data.duration || 0) / 1000);
            const minutes = Math.floor(durationSec / 60);
            const seconds = String(durationSec % 60).padStart(2, "0");
            const durationLabel = `${minutes}:${seconds}`;

            let sizeLabel = "Unknown size";

            try {

                const head = await axios.head(data.url, { timeout: 15000 });

                const bytes = Number(head.headers["content-length"]);

                if (bytes) {
                    sizeLabel = `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
                }

            } catch {}

            if (message.sock) {

                await message.sock.sendMessage(
                    message.chat,
                    {
                        react: {
                            text: "✅",
                            key: message.rawMessage.key
                        }
                    }
                );

            }

            return Reply.audio({

                url: data.url,

                mimetype: "audio/mpeg",

                fileName: `${data.title}.mp3`,

                caption:
`☁️ *${data.title}*

👤 ${data.user} | ⏱ ${durationLabel} | ${sizeLabel} | Kenya-Ultra

🔗 soundcloud.com

━━━━━━━━━━━━━━

✅ Download Complete

🐺 Powered by Kenya-Ultra 👑`,

                contextInfo: {

                    externalAdReply: {
                        title: data.title,
                        body: `${data.user} • ${durationLabel} • ${sizeLabel} • Kenya-Ultra`,
                        thumbnailUrl: data.thumbnail,
                        sourceUrl: first.permalink_url,
                        mediaType: 1,
                        renderLargerThumbnail: true,
                        showAdAttribution: false
                    }

                },

                alsoDocument: true

            });

        } catch (err) {

            return Reply.error(
                err.message || "Failed to download from SoundCloud."
            );

        }

    }

};
                        
