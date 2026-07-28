import MaxxTech from "../utils/maxxtech.js";
import Reply from "../utils/reply.js";

export default {

    name: "compliment",

    description: "Give someone a random compliment. Usage: .compliment [@name]",

    category: "Fun",

    async execute(message) {

        const target =
            (message.args || []).join(" ").trim() ||
            message.pushName ||
            "You";

        try {

            const c = await MaxxTech.request("/compliment");

            return Reply.text(`💐 ${target} — ${c.compliment}`);

        } catch (err) {

            return Reply.error(
                err.message || "Failed to fetch a compliment."
            );

        }

    }

};
