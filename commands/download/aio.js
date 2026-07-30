import Prexzy from "../../utils/prexzy.js";
import Reply from "../../utils/reply.js";

export default {

    name: "aio",

    description: "Download a video from Instagram, TikTok, Facebook, Twitter/X, Pinterest, and more.",

    category: "Download",

    usage: ".aio <link>",

    async execute(message) {

        if (!message.args || !message.args.length) {

            return Reply.error(
`Please provide a media link.

Example:
.aio https://www.facebook.com/share/v/xxxxx/`
            );

        }

        const url = message.args[0];

        try {

            const result = await Prexzy.aioDownload(url);

            const best = result.media[0];

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

                url: best.url,

                fileName: "aio-download.mp4",

                caption:
`📥 *${result.platform || "Media"} Download*

📺 Quality: ${best.quality || "Unknown"}

━━━━━━━━━━━━━━

✅ Download Complete

🐺 Powered by Kenya-Ultra 👑`

            });

        } catch (err) {

            return Reply.error(
                err.message || "Failed to download from that link."
            );

        }

    }

};
