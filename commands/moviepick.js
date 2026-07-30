import Prexzy from "../utils/prexzy.js";
import Reply from "../utils/reply.js";
import SearchCache from "../utils/searchCache.js";

export default {

    name: "moviepick",

    aliases: ["mpick"],

    description: "Pick a numbered result from .moviesearch to get its details/links.",

    category: "Movies",

    usage: ".moviepick <number>",

    async execute(message) {

        const results = SearchCache.get(message.sender);

        if (!results) {

            return Reply.error(
`No active search found. Run .moviesearch <title> first.

Example:
.moviesearch Superman`
            );

        }

        const index = parseInt(message.args?.[0], 10);

        if (!index || index < 1 || index > results.length) {

            return Reply.error(
                `Please reply with a valid number between 1 and ${results.length}.`
            );

        }

        const picked = results[index - 1];

        if (!picked.hasResource) {

            return Reply.error(
                `"${picked.title}" has no playable resource on this source. Try a different result.`
            );

        }

        try {

            const detail = await Prexzy.streamDetail(picked.subjectId);

            // NOTE: the exact shape of a successful /detail response
            // hasn't been confirmed yet, so this formats generically
            // and falls back to a raw dump. Once we see a real success
            // payload this should be tightened up to pull out actual
            // playback/episode links.

            const summary = JSON.stringify(detail, null, 2).slice(0, 1500);

            return Reply.text(
`🎬 *${picked.title}*

${summary}

━━━━━━━━━━━━━━

🐺 Powered by Kenya-Ultra 👑`
            );

        } catch (err) {

            return Reply.error(
                err.message || "Failed to fetch details for that title."
            );

        }

    }

};
