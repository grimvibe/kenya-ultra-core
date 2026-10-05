import Downloader from "../../utils/downloader.js";
import Reply from "../../utils/reply.js";

export default {

    name: "video",

    aliases: ["ytvideo"],

    description: "Search YouTube and download video.",

    category: "Download",

    usage: ".video <name>",

    async execute(message) {

        if (!message.args?.length) {

            return Reply.error(
`Please provide a video name.

Example:
.video Heat Waves`
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
`🎬 *Kenya-Ultra Downloader*

━━━━━━━━━━━━━━

📀 ${video.title}

👤 ${video.author.name}
⏱ ${video.duration}

⬇ Downloading video...`,

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
            const result =
                await Downloader.ytmp4(video.url);

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

            return Reply.download({

                mediaType: "video",

                url: result.downloadUrl,

                title: result.title || video.title,

                thumbnail:
                    result.thumbnail ||
                    video.thumbnail,

                duration:
                    result.duration || video.duration,

                size:
                    result.size || "Unknown",

                source: "YouTube",

                fileName:
                    `${result.title || video.title}.mp4`,

                mimetype:
                    "video/mp4"

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
                "Failed to download video."
            );

        }

    }

};
