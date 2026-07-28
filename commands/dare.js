import MaxxTech from "../utils/maxxtech.js";
import Reply from "../utils/reply.js";

export default {

    name: "dare",

    description: "Get a random dare challenge.",

    category: "Fun",

    async execute() {

        try {

            const d = await MaxxTech.request(
                "/fun/truth-dare",
                { type: "dare" }
            );

            return Reply.text(`🔥 *Dare*\n\n${d.question}`);

        } catch (err) {

            return Reply.error(
                err.message || "Failed to fetch a dare."
            );

        }

    }

};
