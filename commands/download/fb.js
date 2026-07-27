import Downloader from "../../utils/downloader.js";
import Reply from "../../utils/reply.js";

export default {

    name: "fb",

    description: "Download Facebook videos.",

    category: "Download",

    usage: ".fb <url>\n.fb sd <url>\n.fb hd <url>",

    async execute(message) {

        if (!message.args.length) {

            return Reply.error(
`Please provide a Facebook video link.

Examples:

.fb https://facebook.com/...

.fb hd https://facebook.com/...

.fb sd https://facebook.com/...`
            );

        }

        let quality = "720p (HD)";
        let url;

        if (
            message.args[0].toLowerCase() === "sd"
        ) {

            quality = "360p (SD)";
            url = message.args[1];

        }

        else if (
            message.args[0].toLowerCase() === "hd"
        ) {

            quality = "720p (HD)";
            url = message.args[1];

        }

        else {

            url = message.args[0];

        }

        try {

            // ⏳ Reaction
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

            const result =
                await Downloader.fb(url);

            const download =
                result.downloads.find(
                    x => x.quality === quality
                ) || result.downloads[0];

            // Preview Card
            if (message.sock) {

                await message.sock.sendMessage(
                    message.chat,
                    {

                        text:
`📥 *Kenya-Ultra Facebook Downloader*

━━━━━━━━━━━━━━

🎬 ${result.title}

⏱ Duration : ${result.duration}

📺 Quality : ${download.quality}

━━━━━━━━━━━━━━

⬇ Preparing download...`,

                        contextInfo: {

                            externalAdReply: {

                                title: result.title,

                                body:
`${download.quality} • ${result.duration}`,

                                thumbnailUrl:
result.thumbnail,

                                sourceUrl:
url,

                                renderLargerThumbnail: true,

                                mediaType: 1,

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

            // ✅ Reaction
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

                url: download.url,

                fileName:
`${result.title}.mp4`,

                caption:
`🎬 *${result.title}*

━━━━━━━━━━━━━━

📺 ${download.quality}

✅ Download Complete

🐺 Powered by Kenya-Ultra 👑`

            });

        }

        catch (err) {

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
                "Failed to download Facebook video."
            );

        }

    }

};
