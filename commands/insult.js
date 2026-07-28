import MaxxTech from "../utils/maxxtech.js";
import Reply from "../utils/reply.js";

export default {

    name: "insult",

    description: "Send a playful (friendly) roast. Usage: .insult [@name]",

    category: "Fun",

    async execute(message) {

        const target =
            (message.args || []).join(" ").trim() ||
            message.pushName ||
            "You";

        try {

            const i = await MaxxTech.request("/insult");

            return Reply.text(`😂 ${target} — ${i.insult}`);

        } catch (err) {

            return Reply.error(
                err.message || "Failed to fetch an insult."
            );

        }

    }

};
