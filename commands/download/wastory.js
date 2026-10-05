import axios from "axios";
import NexOracle from "../../utils/nexoracle.js";
import Reply from "../../utils/reply.js";

export default {

    name: "wastory",

    aliases: ["wastatus"],

    description: "Download a WhatsApp story/status from a link.",

    category: "Download",

    usage: ".wastory <link>",

    async execute(message) {

        if (!message.args || !message.args.length) {

            return Reply.error(
`Please provide a WhatsApp story link.

Example:
.wastory https://wa.me/status/xxxxx`
            );

        }

        const link = message.args[0];

        try {

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

            const url = NexOracle.buildUrl(
                "/downloader/whatsapp-story",
                { url: link }
            );

            const { data } = await axios.get(url);

            // NOTE: verify this against a live response — API shape
            // wasn't confirmed at write time, so this covers the
            // most likely fields Nexoracle downloader endpoints use.
            const result = data?.result || data;

            const mediaUrl =
                result?.download_url ||
                result?.url ||
                result?.video ||
                result?.image;

            if (!mediaUrl) {
                throw new Error("No media found for that story link.");
            }

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

            const isVideo =
                /\.mp4($|\?)/i.test(mediaUrl) ||
                result?.type === "video";

            if (isVideo) {

                return Reply.video({

                    url: mediaUrl,

                    fileName: "wastory.mp4",

                    caption:
`📖 *WhatsApp Story*

✅ Download Complete

🐺 Powered by Kenya-Ultra 👑`

                });

            }

            return Reply.image({

                url: mediaUrl,

                caption:
`📖 *WhatsApp Story*

✅ Download Complete

🐺 Powered by Kenya-Ultra 👑`

            });

        } catch (err) {

            console.error("wastory error:", err.message);

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
                "Failed to download that WhatsApp story."
            );

        }

    }

};
