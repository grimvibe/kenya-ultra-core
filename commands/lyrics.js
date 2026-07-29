import Prexzy from "../utils/prexzy.js";
import Reply from "../utils/reply.js";

export default {

    name: "lyrics",

    description: "Search for song lyrics.",

    category: "Search",

    usage: ".lyrics <song title>",

    async execute(message) {

        if (!message.args || !message.args.length) {

            return Reply.error(
`Please provide a song title.

Example:
.lyrics Bad Liar`
            );

        }

        const title = message.args.join(" ");

        try {

            const song = await Prexzy.lyricsSearch(title);

            return Reply.text(
`🎶 *${song.title}*
👤 ${song.artist}${song.album ? `\n💿 ${song.album}` : ""}

${song.lyrics}

━━━━━━━━━━━━━━

🐺 Powered by Kenya-Ultra 👑`
            );

        } catch (err) {

            return Reply.error(
                err.message || "Failed to find lyrics for that song."
            );

        }

    }

};
