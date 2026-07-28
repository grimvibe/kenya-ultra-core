import MaxxTech from "../utils/maxxtech.js";
import Reply from "../utils/reply.js";

export default {

    name: "ai",

    aliases: ["gpt", "ask"],

    description: "Ask the AI a question.",

    category: "AI",

    usage: ".ai <question>",

    async execute(message) {

        if (!message.args || !message.args.length) {

            return Reply.error(
`Please provide a question.

Example:
.ai What is the capital of Kenya?`
            );

        }

        const prompt = message.args.join(" ");

        try {

            const data = await MaxxTech.request(
                "/ai/text",
                {
                    prompt,
                    model: "openai"
                }
            );

            return Reply.text(
`🤖 *Kenya-Ultra AI*

${data.response}

━━━━━━━━━━━━━━

🐺 Powered by Kenya-Ultra 👑`
            );

        } catch (err) {

            return Reply.error(
                err.message || "AI request failed. Please try again."
            );

        }

    }

};
