import MaxxTech from "../utils/maxxtech.js";
import Reply from "../utils/reply.js";

export default {

    name: "truth",

    description: "Get a random truth question.",

    category: "Fun",

    async execute() {

        try {

            const t = await MaxxTech.request(
                "/fun/truth-dare",
                { type: "truth" }
            );

            return Reply.text(`🤫 *Truth*\n\n${t.question}`);

        } catch (err) {

            return Reply.error(
                err.message || "Failed to fetch a truth question."
            );

        }

    }

};
