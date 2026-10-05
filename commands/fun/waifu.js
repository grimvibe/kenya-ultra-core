import axios from "axios";
import Reply from "../../utils/reply.js";

// Primary: waifu.im. Falls back to waifu.pics if the primary is
// unreachable for any reason (including DNS-level failures, which
// can happen transiently on some hosting networks).

async function fromWaifuIm() {

    const { data } = await axios.get(
        "https://api.waifu.im/search",
        {
            params: { is_nsfw: false },
            timeout: 10000
        }
    );

    return data.images?.[0]?.url || null;

}

async function fromWaifuPics() {

    const { data } = await axios.get(
        "https://api.waifu.pics/sfw/waifu",
        { timeout: 10000 }
    );

    return data.url || null;

}

export default {

    name: "waifu",

    description: "Get a random anime waifu image.",

    category: "Fun",

    usage: ".waifu",

    async execute() {

        let url = null;

        try {

            url = await fromWaifuIm();

        } catch (err) {

            console.error("waifu.im failed:", err.message);

            try {

                url = await fromWaifuPics();

            } catch (err2) {

                console.error("waifu.pics fallback also failed:", err2.message);

            }

        }

        if (!url) {
            return Reply.error("Couldn't fetch an image right now, try again.");
        }

        return Reply.image({
            url,
            caption: "🌸 Random waifu!"
        });

    }

};
