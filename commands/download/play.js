import axios from "axios";
import Downloader from "../../utils/downloader.js";
import Reply from "../../utils/reply.js";

export default {

    name: "play",
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

            // ⏳ React
            if (message.sock) {
                await message.sock.sendMessage(
                    message.chat,
                    {
                        react: {
                            text: "⏳",
                            key: message.rawMessage.key
                        }
                    }
                );
            }

            // Search YouTube
            const search = await Downloader.yts(query);

            if (!search.result.length) {

                return Reply.error(
                    "No results found."
                );

            }

            const video = search.result[0];

            // Preview
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

                                body:
`${video.author.name} • ${video.duration}`,

                                thumbnailUrl:
video.thumbnail,

                                sourceUrl:
video.url,

                                mediaType: 1,

                                renderLargerThumbnail: true,

                                showAdAttribution: false

                            }

                        }

                    }

                );

                await message.sock.sendMessage(
                    message.chat,
                    {
                        react: {
                            text: "⬇️",
                            key: message.rawMessage.key
                        }
                    }
                );

            }

            // Download
            const audio =
                await Downloader.ytmp3(video.url);

            // Work out file size for the caption
            let sizeLabel = "Unknown size";

            try {

                const head = await axios.head(
                    audio.downloadUrl,
                    { timeout: 15000 }
                );

                const bytes =
                    Number(head.headers["content-length"]);

                if (bytes) {

                    sizeLabel =
                        `${(bytes / (1024 * 1024)).toFixed(1)}MB`;

                }

            } catch {}

            // ✅ React
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

                url: audio.downloadUrl,

                fileName:
`${audio.title}.mp3`,

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

                        body:
`${video.author.name} • ${video.duration} • ${sizeLabel} • Kenya-Ultra`,

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
                    {
                        react: {
                            text: "❌",
                            key: message.rawMessage.key
                        }
                    }
                );

            }

            return Reply.error(
                err.message ||
                "Failed to download audio."
            );

        }

    }

};
            
