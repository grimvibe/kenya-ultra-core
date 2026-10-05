import { askAI } from "../utils/aiChain.js";
import Reply from "../utils/reply.js";

const SYSTEM_PROMPT =
    "You are a coding assistant. Respond with clean, working code and " +
    "a brief explanation. Use markdown code blocks for any code.";

export default {

    name: "coder",

    aliases: ["deepseek", "code"],

    description: "Ask a coding question.",

    category: "AI",

    usage: ".coder <prompt>",

    async execute(message) {

        if (!message.args || !message.args.length) {

            return Reply.error(
`Please provide a coding question or prompt.

Example:
.coder write a function to reverse a string in JavaScript`
            );

        }

        const prompt = message.args.join(" ");

        try {

            const response = await askAI(prompt, SYSTEM_PROMPT);

            return Reply.text(
`👨‍💻 *Kenya-Ultra Coder*

${response}

━━━━━━━━━━━━━━

🐺 Powered by Kenya-Ultra 👑`
            );

        } catch (err) {

            console.error("coder error:", err.message);

            return Reply.error(
                "AI request failed. Please try again."
            );

        }

    }

};
