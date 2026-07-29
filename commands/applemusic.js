import Prexzy from "../utils/prexzy.js";
import Reply from "../utils/reply.js";

export default {

    name: "applemusic",

    aliases: ["amusic"],

    description: "Search for songs, artists, albums, or playlists on Apple Music.",

    category: "Search",

    usage: ".applemusic <query>",

    async execute(message) {

        if (!message.args || !message.args.length) {

            return Reply.error(
`Please provide a search term.

Example:
.applemusic Bad Liar`
            );

        }

        const query = message.args.join(" ");

        try {

            const results = await Prexzy.appleMusicSearch(query);

            const lines = results.slice(0, 6).map((r, i) =>
                `${i + 1}. *${r.title}* — ${r.artist}\n${r.link}`
            );

            return Reply.image({

                url: results[0]?.image,

                caption:
`🎵 *Apple Music Search: ${query}*

${lines.join("\n\n")}

━━━━━━━━━━━━━━

🐺 Powered by Kenya-Ultra 👑`

            });

        } catch (err) {

            return Reply.error(
                err.message || "Failed to search Apple Music."
            );

        }

    }

};
