import Downloader from "../../utils/downloader.js";
import Reply from "../../utils/reply.js";

export default {

    name: "capcut",

    description: "Download a CapCut video.",

    category: "Download",

    usage: ".capcut <capcut-link>",

    async execute(message) {

        if (!message.args || !message.args.length) {

            return Reply.error(
`Please provide a CapCut link.

Example:
.capcut https://www.capcut.com/tv2/ZSmm1R7Sd/`
            );

        }

        const url = message.args[0];

        try {

            const data = await Downloader.capcut(url);

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

            return Reply.video({

                url: data.originalVideoUrl,

                fileName: "capcut-video.mp4",

                caption:
`🎬 *${data.title || "CapCut Video"}*

👤 ${data.authorName || "Unknown"}

━━━━━━━━━━━━━━

✅ Download Complete

🐺 Powered by Kenya-Ultra 👑`,

                contextInfo: {

                    externalAdReply: {
                        title: data.title || "CapCut Video",
                        body: data.authorName || "Kenya-Ultra",
                        thumbnailUrl: data.coverUrl,
                        sourceUrl: url,
                        mediaType: 1,
                        renderLargerThumbnail: true,
                        showAdAttribution: false
                    }

                }

            });

        } catch (err) {

            return Reply.error(
                err.message || "Failed to download CapCut video."
            );

        }

    }

};
