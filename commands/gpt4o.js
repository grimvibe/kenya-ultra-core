import { askAI } from "../utils/aiChain.js";
import Reply from "../utils/reply.js";

const SYSTEM_PROMPT =
    "Your name is Kenya-Ultra AI, developed by Kenya-Ultra. " +
    "Respond to the user accurately and helpfully.";

export default {

    name: "gpt4o",

    aliases: ["4o"],

    description: "Ask Kenya-Ultra AI a question.",

    category: "AI",

    usage: ".gpt4o <question>",

    async execute(message) {

        if (!message.args || !message.args.length) {

            return Reply.error(
`Please provide a question.

Example:
.gpt4o What is the capital of Kenya?`
            );

        }

        const userPrompt = message.args.join(" ");

        try {

            const response = await askAI(userPrompt, SYSTEM_PROMPT);

            return Reply.text(
`🤖 *Kenya-Ultra AI (GPT-4o)*

${response}

━━━━━━━━━━━━━━

🐺 Powered by Kenya-Ultra 👑`
            );

        } catch (err) {

            console.error("gpt4o error:", err.message);

            return Reply.error(
                "AI request failed. Please try again."
            );

        }

    }

};
