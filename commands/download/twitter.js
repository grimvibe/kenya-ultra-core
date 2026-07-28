import Downloader from "../../utils/downloader.js";
import Reply from "../../utils/reply.js";

export default {

    name: "twitter",

    aliases: ["x", "tw"],

    description: "Download a video from Twitter/X.",

    category: "Download",

    usage: ".twitter <tweet-link>",

    async execute(message) {

        if (!message.args || !message.args.length) {

            return Reply.error(
`Please provide a Twitter/X link.

Example:
.twitter https://twitter.com/9GAG/status/1661175429859012608`
            );

        }

        const url = message.args[0];

        try {

            const data = await Downloader.twitter(url);

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

                url: data.downloadLink,

                fileName: "twitter-video.mp4",

                caption:
`🐦 *${data.videoTitle || "Twitter Video"}*

${data.videoDescription || ""}

━━━━━━━━━━━━━━

✅ Download Complete

🐺 Powered by Kenya-Ultra 👑`,

                contextInfo: {

                    externalAdReply: {
                        title: data.videoTitle || "Twitter Video",
                        body: "Kenya-Ultra",
                        thumbnailUrl: data.imgUrl,
                        sourceUrl: url,
                        mediaType: 1,
                        renderLargerThumbnail: true,
                        showAdAttribution: false
                    }

                }

            });

        } catch (err) {

            return Reply.error(
                err.message || "Failed to download Twitter video."
            );

        }

    }

};
