import Davex from "../utils/davex.js";
import Reply from "../utils/reply.js";
import SearchCache from "../utils/searchCache.js";

export default {

    name: "moviegenre",

    aliases: ["genremovies"],

    description: "Browse movies/series by genre (e.g. Action, Comedy, Horror).",

    category: "Movies",

    usage: ".moviegenre <genre> [page]",

    async execute(message) {

        if (!message.args || !message.args.length) {

            return Reply.error(
`Please provide a genre.

Example:
.moviegenre Action`
            );

        }

        const args = [...message.args];

        const lastArg = args[args.length - 1];

        let page = 1;

        if (/^\d+$/.test(lastArg)) {
            page = parseInt(args.pop(), 10);
        }

        const genre = args.join(" ");

        try {

            const results = await Davex.byGenre(genre, page, 20);

            if (!results.length) {
                return Reply.error(
                    `No results found for genre "${genre}".`
                );
            }

            const top = results.slice(0, 10).map(item => ({

                subjectId: item.subject_id,
                title: item.title,
                year: item.year || "N/A",
                type: item.subject_type === 1 ? "Movie" : "Series",
                hasResource: true, // /movie/genre doesn't expose this flag
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
`🎭 *${genre} — Page ${page}*

${lines.join("\n")}

━━━━━━━━━━━━━━

Reply with:
.moviepick <number>

🐺 Powered by Kenya-Ultra 👑`

            });

        } catch (err) {

            return Reply.error(
                err.message || "Failed to fetch that genre."
            );

        }

    }

};
