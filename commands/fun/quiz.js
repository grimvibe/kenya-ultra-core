import Prexzy from "../../utils/prexzy.js";
import Reply from "../../utils/reply.js";

export default {

    name: "quiz",

    aliases: ["guessquiz"],

    description: "Get a random image-guessing quiz question.",

    category: "Fun",

    usage: ".quiz",

    async execute(message) {

        try {

            const questions = await Prexzy.quizRandom();

            const q =
                questions[Math.floor(Math.random() * questions.length)];

            const answerText =
                Array.isArray(q.answer) ? q.answer.join(" / ") : q.answer;

            return Reply.image({

                url: q.image,

                caption:
`🧩 *Guess It!*

${q.question || "What is this?"}

⏱ ${q.timer || 15}s

_Answer: ${answerText}_

━━━━━━━━━━━━━━

🐺 Powered by Kenya-Ultra 👑`

            });

        } catch (err) {

            return Reply.error(
                err.message || "Failed to fetch a quiz question."
            );

        }

    }

};
