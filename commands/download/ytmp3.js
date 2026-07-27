import Downloader from "../../utils/downloader.js";
import Reply from "../../utils/reply.js";

export default {

    name: "ytmp3",

    description: "Download YouTube audio.",

    category: "Download",

    usage: ".ytmp3 <youtube-link>",

    async execute(message) {

        // Get the raw command text regardless of Core format
        const raw =
            message.text ||
            message.body ||
            message.content ||
            message.message ||
            "";

        // Extract everything after the command
        const parts = raw.trim().split(/\s+/);

        if (parts.length < 2) {

            return Reply.error(
`Please provide a YouTube link.

Example:
.ytmp3 https://youtu.be/dQw4w9WgXcQ`
            );

        }

        const url = parts.slice(1).join(" ");

        try {

            const result = await Downloader.ytmp3(url);

            return Reply.audio({

                url: result.downloadUrl,

                fileName: `${result.title}.mp3`,

                caption:
`🎵 *${result.title}*

⬇️ Download completed successfully.

🐺 Powered by Kenya-Ultra 👑`

            });

        }

        catch (err) {

            console.log(err);

            return Reply.error(
                err.message || "Failed to download audio."
            );

        }

    }

};
