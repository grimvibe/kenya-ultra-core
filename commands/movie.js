import Prexzy from "../utils/prexzy.js";
import Reply from "../utils/reply.js";

export default {

    name: "movie",

    aliases: ["movieinfo", "minfo"],

    description: "Search movie or TV show info (overview, rating, poster).",

    category: "Movies",

    usage: ".movie <title>",

    async execute(message) {

        if (!message.args || !message.args.length) {

            return Reply.error(
`Please provide a title to search.

Example:
.movie Moana`
            );

        }

        const query = message.args.join(" ");

        try {

            const results = await Prexzy.movieSearch(query);

            if (!results.length) {
                return Reply.error(
                    `No results found for "${query}".`
                );
            }

            const top = results.slice(0, 8);

            const lines = top.map((item, i) => {

                const title = item.title || item.name || "Unknown";

                const date =
                    item.release_date || item.first_air_date || "";

                const year = date ? date.slice(0, 4) : "N/A";

                const type = item.media_type === "tv" ? "TV" : "Movie";

                const rating = item.vote_average
                    ? item.vote_average.toFixed(1)
                    : "N/A";

                return `${i + 1}. *${title}* (${year}) [${type}] — ⭐ ${rating}`;

            });

            const first = top[0];

            const poster = first.poster_path
                ? `https://image.tmdb.org/t/p/w500${first.poster_path}`
                : undefined;

            const overview = first.overview
                ? first.overview.slice(0, 300)
                : "No overview available.";

            return Reply.image({

                url: poster,

                caption:
`🎬 *Movie Search: ${query}*

${lines.join("\n")}

━━━━━━━━━━━━━━
📖 *${first.title || first.name}*
${overview}

━━━━━━━━━━━━━━

Want streaming links? Try:
.moviesearch ${query}

🐺 Powered by Kenya-Ultra 👑`

            });

        } catch (err) {

            return Reply.error(
                err.message || "Failed to search for that title."
            );

        }

    }

};
