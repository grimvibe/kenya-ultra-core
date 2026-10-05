import Davex from "../utils/davex.js";
import Reply from "../utils/reply.js";
import SearchCache from "../utils/searchCache.js";

export default {

    name: "newmovies",

    aliases: ["movienew", "latestmovies"],

    description: "Browse the newest movie/series releases.",

    category: "Movies",

    usage: ".newmovies [page]",

    async execute(message) {

        const page = parseInt(message.args?.[0], 10) || 1;

        try {

            const results = await Davex.newest(page, 20);

            if (!results.length) {
                return Reply.error("No results found for that page.");
            }

            const top = results.slice(0, 10).map(item => ({

                subjectId: item.subject_id,
                title: item.title,
                year: item.year || "N/A",
                type: item.subject_type === 1 ? "Movie" : "Series",
                hasResource: true, // /movie/new doesn't expose this flag
                rating: "N/A",
                poster: item.poster_url || item.cover?.url

            }));

            SearchCache.set(message.sender, top);

            const lines = top.map((item, i) => {

                return `${i + 1}. *${item.title}* (${item.year}) [${item.type}]`;

            });

            return Reply.image({

                url: top[0].poster,

                caption:
`🆕 *Newest Releases — Page ${page}*

${lines.join("\n")}

━━━━━━━━━━━━━━

Reply with:
.moviepick <number>

🐺 Powered by Kenya-Ultra 👑`

            });

        } catch (err) {

            return Reply.error(
                err.message || "Failed to fetch new releases."
            );

        }

    }

};
