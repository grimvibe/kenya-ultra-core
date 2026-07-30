import Prexzy from "../../utils/prexzy.js";
import Reply from "../../utils/reply.js";

export default {

    name: "tiktok",

    aliases: ["tk"],

    description: "Download a TikTok video (no watermark).",

    category: "Download",

    usage: ".tiktok <link>",

    async execute(message) {

        if (!message.args || !message.args.length) {

            return Reply.error(
`Please provide a TikTok link.

Example:
.tiktok https://vt.tiktok.com/xxxxx/`
            );

        }

        const url = message.args[0];

        // ==========================
        // Primary source
        // ==========================

        try {

            const result = await Prexzy.tiktok(url);

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

                url: result.hdplay || result.play,

                fileName: "tiktok.mp4",

                caption:
`🎵 *${result.title || "TikTok Video"}*

👤 ${result.author?.nickname || "Unknown"} (@${result.author?.unique_id || "unknown"})

❤️ ${result.digg_count ?? "N/A"} | 💬 ${result.comment_count ?? "N/A"} | ▶️ ${result.play_count ?? "N/A"}

━━━━━━━━━━━━━━

✅ Download Complete

🐺 Powered by Kenya-Ultra 👑`

            });

        } catch (primaryErr) {

            console.error("tiktok primary source failed:", primaryErr.message);

            // ==========================
            // Fallback source
            // ==========================

            try {

                const fb = await Prexzy.tiktokAlt(url);

                const best =
                    fb.video_downloads.find(v => v.quality === "HD") ||
                    fb.video_downloads[0];

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

                    fileName: "tiktok.mp4",

                    caption:
`🎵 *${fb.title || "TikTok Video"}*

━━━━━━━━━━━━━━

✅ Download Complete (fallback)

🐺 Powered by Kenya-Ultra 👑`

                });

            } catch (fallbackErr) {

                console.error("tiktok fallback source failed:", fallbackErr.message);

                return Reply.error(
                    "Failed to download that TikTok video. Please try again later."
                );

            }

        }

    }

};
