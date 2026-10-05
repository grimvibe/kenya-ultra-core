import Prexzy from "../utils/prexzy.js";
import Reply from "../utils/reply.js";
import SearchCache from "../utils/searchCache.js";

export default {

    name: "moviesearch",

    aliases: ["mlinks", "watchsearch"],

    description: "Search for a movie/series on the streaming source (step 1 of getting links).",

    category: "Movies",

    usage: ".moviesearch <title>",

    async execute(message) {

        if (!message.args || !message.args.length) {

            return Reply.error(
`Please provide a title to search.

Example:
.moviesearch Superman`
            );

        }

        const query = message.args.join(" ");

        try {

            const items = await Prexzy.streamSearch(query);

            if (!items.length) {
                return Reply.error(
                    `No results found for "${query}".`
                );
            }

            const top = items.slice(0, 10).map(item => ({

                subjectId: item.subjectId,
                title: item.title,
                year: item.releaseDate ? item.releaseDate.slice(0, 4) : "N/A",
                type: item.subjectType === 1 ? "Movie" : "Series",
                hasResource: !!item.hasResource,
                rating: item.imdbRatingValue || "N/A",
                poster: item.cover?.url

            }));

            SearchCache.set(message.sender, top);

            const lines = top.map((item, i) => {

                const resource = item.hasResource ? "✅" : "⚠️ no link";

                return `${i + 1}. *${item.title}* (${item.year}) [${item.type}] — ⭐ ${item.rating} ${resource}`;

            });

            const first = top[0];

            return Reply.image({

                url: first.poster,

                caption:
`🔎 *Streaming Search: ${query}*

${lines.join("\n")}

━━━━━━━━━━━━━━

Reply with:
.moviepick <number>

to get that title's links.

🐺 Powered by Kenya-Ultra 👑`

            });

        } catch (err) {

            return Reply.error(
                err.message || "Failed to search for that title."
            );

        }

    }

};
