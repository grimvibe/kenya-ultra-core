import MaxxTech from "../../utils/maxxtech.js";
import Reply from "../../utils/reply.js";

export default {

    name: "8ball",

    description: "Ask the magic 8-ball a question. Usage: .8ball Will I pass my exam?",

    category: "Fun",

    async execute(message) {

        const question = (message.args || []).join(" ").trim();

        if (!question) {
            return Reply.error("Ask a question. Example: .8ball Will I pass my exam?");
        }

        try {

            const b = await MaxxTech.request(
                "/8ball",
                { q: question }
            );

            return Reply.text(
`🎱 *Magic 8-Ball*

❓ ${b.question}

${b.answer}`
            );

        } catch (err) {

            return Reply.error(
                err.message || "The magic 8-ball is unavailable right now."
            );

        }

    }

};
