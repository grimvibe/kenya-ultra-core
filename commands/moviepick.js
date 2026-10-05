import Davex from "../utils/davex.js";
import Prexzy from "../utils/prexzy.js";
import Reply from "../utils/reply.js";
import SearchCache from "../utils/searchCache.js";

// Pulls a flat, deduped list of { resolution, size } from Davex's
// resource_detectors[].resolution_list[], sorted low → high.
function extractResolutions(info) {

    const list = info?.resource_detectors?.[0]?.resolution_list || [];

    const seen = new Map();

    for (const r of list) {

        if (!r.resolution) continue;

        if (!seen.has(r.resolution) || r.size > seen.get(r.resolution).size) {
            seen.set(r.resolution, r);
        }

    }

    return [...seen.values()].sort((a, b) => a.resolution - b.resolution);

}

function formatSize(bytes) {

    if (!bytes) return "Unknown size";

    const mb = bytes / (1024 * 1024);

    if (mb > 1024) return `${(mb / 1024).toFixed(2)} GB`;

    return `${mb.toFixed(0)} MB`;

}

export default {

    name: "moviepick",

    aliases: ["mpick"],

    description: "Pick a numbered result from a movie search/browse command to see details and resolutions.",

    category: "Movies",

    usage: ".moviepick <number>",

    async execute(message) {

        const results = SearchCache.get(message.sender);

        if (!results) {

            return Reply.error(
`No active search found. Run one of these first:

.moviesearch <title>
.popularmovies
.newmovies
.moviegenre <genre>`
            );

        }

        const index = parseInt(message.args?.[0], 10);

        if (!index || index < 1 || index > results.length) {

            return Reply.error(
                `Please reply with a valid number between 1 and ${results.length}.`
            );

        }

        const picked = results[index - 1];

        // Try Davex first (confirmed working, has real links)
        try {

            const info = await Davex.movieInfo(picked.subjectId);

            const resolutions = extractResolutions(info);

            if (!resolutions.length) {
                throw new Error("No playable resolutions found.");
            }

            // Store the resolved subjectId + resolutions for .moviedl
            SearchCache.set(`${message.sender}:pick`, {
                subjectId: picked.subjectId,
                title: info.title || picked.title,
                resolutions: resolutions.map(r => r.resolution)
            });

            const resLines = resolutions.map(r =>
                `• ${r.resolution}P — ${formatSize(r.size)}`
            ).join("\n");

            const cast = (info.staff_list || [])
                .filter(s => s.staff_type === 1)
                .slice(0, 4)
                .map(s => s.name)
                .join(", ");

            return Reply.image({

                url: info.cover?.url || picked.poster,

                caption:
`🎬 *${info.title || picked.title}* (${info.release_date?.slice(0, 4) || picked.year})

${info.description ? info.description.slice(0, 250) : "No description available."}

⭐ IMDb: ${info.imdb_rating_value || "N/A"}
🎭 Genre: ${(info.genre || []).join(", ") || "N/A"}
⏱️ Duration: ${info.duration || "N/A"}
${cast ? `🎞️ Cast: ${cast}` : ""}

━━━━━━━━━━━━━━
📥 *Available resolutions:*
${resLines}

To download, reply with:
.moviedl <resolution>

Example: .moviedl 720

🐺 Powered by Kenya-Ultra 👑`

            });

        } catch (davexErr) {

            // Fall back to Prexzy's streaming detail endpoint
            try {

                const detail = await Prexzy.streamDetail(picked.subjectId);

                const summary = JSON.stringify(detail, null, 2).slice(0, 1200);

                return Reply.text(
`🎬 *${picked.title}*

⚠️ Primary source unavailable (${davexErr.message}). Showing fallback data:

${summary}

━━━━━━━━━━━━━━

🐺 Powered by Kenya-Ultra 👑`
                );

            } catch (prexzyErr) {

                return Reply.error(
                    `Couldn't fetch details for "${picked.title}" from either source. (${davexErr.message} / ${prexzyErr.message})`
                );

            }

        }

    }

};
