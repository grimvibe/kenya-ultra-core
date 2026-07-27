import Downloader from "../../utils/downloader.js";
import Reply from "../../utils/reply.js";

export default {

    name: "ytmp3",

    description: "Download YouTube audio.",

    category: "Download",

    usage: ".ytmp3 <youtube-link>",

    async execute(message) {

        if (!message.args || !message.args.length) {

            return Reply.error(
`Please provide a YouTube link.

Example:
.ytmp3 https://youtu.be/dQw4w9WgXcQ`
            );

        }

        const url = message.args[0];

        try {

            const result = await Downloader.ytmp3(url);

            return Reply.audio({

                url: result.downloadUrl,

                fileName: `${result.title}.mp3`,

                caption:
`🎵 *${result.title}*

━━━━━━━━━━━━━━

✅ Download Complete

🐺 Powered by Kenya-Ultra 👑`

            });

        } catch (err) {

            console.error(err);

            return Reply.error(

                err.message ||

                "Failed to download audio."

            );

        }

    }

};
