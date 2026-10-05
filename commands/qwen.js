import { askAI } from "../utils/aiChain.js";
import Reply from "../utils/reply.js";

export default {

    name: "qwen",

    description: "Ask Kenya-Ultra AI a question.",

    category: "AI",

    usage: ".qwen <question>",

    async execute(message) {

        if (!message.args || !message.args.length) {

            return Reply.error(
`Please provide a question.

Example:
.qwen What is the capital of Kenya?`
            );

        }

        const prompt = message.args.join(" ");

        try {

            const response = await askAI(prompt);

            return Reply.text(
`🤖 *Kenya-Ultra AI (Qwen)*

${response}

━━━━━━━━━━━━━━

🐺 Powered by Kenya-Ultra 👑`
            );

        } catch (err) {

            console.error("qwen error:", err.message);

            return Reply.error(
                "AI request failed. Please try again."
            );

        }

    }

};
