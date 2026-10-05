import Prexzy from "../utils/prexzy.js";
import Reply from "../utils/reply.js";

export default {

    name: "wallpaper",

    aliases: ["wp"],

    description: "Search for an HD wallpaper.",

    category: "Utility",

    usage: ".wallpaper <search term>",

    async execute(message) {

        if (!message.args || !message.args.length) {

            return Reply.error(
`Please provide something to search for.

Example:
.wallpaper cyberpunk city`
            );

        }

        const query = message.args.join(" ");

        try {

            const results = await Prexzy.wallpaperSearch(query);

            const pick =
                results[Math.floor(Math.random() * results.length)];

            const imageUrl =
                pick.url || pick.image || pick.download_url || pick.src;

            if (!imageUrl) {
                return Reply.error("No wallpaper image found for that search.");
            }

            return Reply.image({

                url: imageUrl,

                caption:
`🖼️ *Wallpaper: ${query}*

🐺 Powered by Kenya-Ultra 👑`

            });

        } catch (err) {

            return Reply.error(
                err.message || "Failed to find a wallpaper for that search."
            );

        }

    }

};
