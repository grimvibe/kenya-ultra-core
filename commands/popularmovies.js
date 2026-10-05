import Davex from "../utils/davex.js";
import Reply from "../utils/reply.js";
import SearchCache from "../utils/searchCache.js";

export default {

    name: "popularmovies",

    aliases: ["moviepopular"],

    description: "Browse currently popular movies/series.",

    category: "Movies",

    usage: ".popularmovies [page]",

    async execute(message) {

        const page = parseInt(message.args?.[0], 10) || 1;

        try {

            const results = await Davex.popular(page);

            if (!results.length) {
                return Reply.error("No results found for that page.");
            }

            const top = results.slice(0, 10).map(item => ({

                subjectId: item.subject_id,
                title: item.title,
                year: item.year || "N/A",
                type: item.subject_type === 1 ? "Movie" : "Series",
                hasResource: !!item.has_resource,
                rating: "N/A",
                poster: item.poster_url

            }));

            SearchCache.set(message.sender, top);

            const lines = top.map((item, i) => {

                const resource = item.hasResource ? "✅" : "⚠️ no link";

                return `${i + 1}. *${item.title}* (${item.year}) [${item.type}] ${resource}`;

            });

            return Reply.image({

                url: top[0].poster,

                caption:
`🔥 *Popular Movies & Series — Page ${page}*

${lines.join("\n")}

━━━━━━━━━━━━━━

Reply with:
.moviepick <number>

🐺 Powered by Kenya-Ultra 👑`

            });

        } catch (err) {

            return Reply.error(
                err.message || "Failed to fetch popular titles."
            );

        }

    }

};
