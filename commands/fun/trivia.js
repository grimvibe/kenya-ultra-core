import MaxxTech from "../../utils/maxxtech.js";
import Reply from "../../utils/reply.js";

function decodeEntities(str = "") {

    return str
        .replace(/&amp;/g, "&")
        .replace(/&quot;/g, "\"")
        .replace(/&#039;/g, "'")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">");

}

export default {

    name: "trivia",

    description: "Get a random trivia question with its answer. Usage: .trivia [easy|medium|hard]",

    category: "Fun",

    async execute(message) {

        const difficulty =
            (message.args || [])[0]?.toLowerCase() || "medium";

        try {

            const t = await MaxxTech.request(
                "/trivia",
                { difficulty }
            );

            const q = t.questions?.[0];

            if (!q) {
                throw new Error("No trivia question returned.");
            }

            return Reply.text(
`🧠 *Trivia* (${decodeEntities(q.category)} — ${q.difficulty})

${decodeEntities(q.question)}

_Answer: ${decodeEntities(q.correct_answer)}_`
            );

        } catch (err) {

            return Reply.error(
                err.message || "Failed to fetch a trivia question."
            );

        }

    }

};
