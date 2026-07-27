import Downloader from "../../utils/downloader.js";
import Reply from "../../utils/reply.js";
import {
    startLoading,
    finishLoading,
    failLoading
} from "../../utils/loading.js";

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

        let loading;

        try {

            loading = await startLoading(

                message.sock,

                message.chat,

                message.rawMessage,

`╭━━━〔 🎵 Kenya-Ultra Downloader 〕━━━⬣

⏳ Downloading Audio...

━━━━━━━━━━━━━━

🔍 Fetching YouTube...

📦 Preparing Audio...

⚡ Please wait...

━━━━━━━━━━━━━━

🐺 Powered by Kenya-Ultra 👑`

            );

            const result = await Downloader.ytmp3(url);

            await finishLoading(

                message.sock,

                message.chat,

                message.rawMessage,

                loading

            );

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

            await failLoading(

                message.sock,

                message.chat,

                message.rawMessage,

                loading

            );

            return Reply.error(

                err.message ||

                "Failed to download audio."

            );

        }

    }

};
