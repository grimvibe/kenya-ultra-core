import axios from "axios";
import Reply from "../../utils/reply.js";

export default {

    name: "bible",

    description: "Get a Bible verse. Leave blank for a random-ish daily one.",

    category: "Fun",

    usage: ".bible <reference, e.g. john 3:16>",

    async execute(message) {

        const reference = message.args?.length
            ? message.args.join(" ")
            : "proverbs 3:5-6";

        try {

            const { data } = await axios.get(
                `https://bible-api.com/${encodeURIComponent(reference)}`,
                { timeout: 10000 }
            );

            if (!data.text) {
                return Reply.error(`Couldn't find "${reference}". Try a format like "john 3:16".`);
            }

            return Reply.text(
`📖 *${data.reference}*

${data.text.trim()}

_${data.translation_name || "KJV"}_`
            );

        } catch (err) {

            return Reply.error(
                `Couldn't find "${reference}". Try a format like "john 3:16".`
            );

        }

    }

};
