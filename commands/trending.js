import Prexzy from "../utils/prexzy.js";
import Reply from "../utils/reply.js";

export default {

    name: "trending",

    description: "Show trending movies and TV shows.",

    category: "Movies",

    usage: ".trending",

    async execute(message) {

        try {

            const list = await Prexzy.trending();

            const top = list.slice(0, 10);

            const lines = top.map((item, i) => {

                const year =
                    item.releaseDate?.slice(0, 4) || "Unknown";

                return `${i + 1}. *${item.title}* (${year}) — ${item.genre || "N/A"} — ⭐ ${item.imdbRatingValue || "N/A"}`;

            });

            return Reply.image({

                url: top[0]?.cover?.url,

                caption:
`🔥 *Trending Now*

${lines.join("\n")}

━━━━━━━━━━━━━━

🐺 Powered by Kenya-Ultra 👑`

            });

        } catch (err) {

            return Reply.error(
                err.message || "Failed to fetch trending titles."
            );

        }

    }

};
