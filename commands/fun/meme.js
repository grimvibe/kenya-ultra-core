import axios from "axios";
import Reply from "../../utils/reply.js";

// Reddit blocks most cloud-provider IPs (Cloud Run, AWS, etc.) from
// hitting reddit.com directly with a 403, so this goes through
// meme-api.com instead — a free wrapper built specifically for bots
// that pulls from Reddit server-side and isn't subject to that block.
const SUBREDDITS = ["memes", "dankmemes", "wholesomememes"];

export default {

    name: "meme",

    description: "Get a random meme from Reddit.",

    category: "Fun",

    usage: ".meme",

    async execute() {

        const sub = SUBREDDITS[Math.floor(Math.random() * SUBREDDITS.length)];

        try {

            const { data } = await axios.get(
                `https://meme-api.com/gimme/${sub}`,
                { timeout: 10000 }
            );

            if (!data.url || data.nsfw) {
                return Reply.error("Couldn't find a meme right now, try again.");
            }

            return Reply.image({

                url: data.url,

                caption:
`😂 *${data.title}*

👍 ${data.ups.toLocaleString()} upvotes | r/${data.subreddit}`

            });

        } catch (err) {

            return Reply.error(
                err.message || "Failed to fetch a meme."
            );

        }

    }

};
