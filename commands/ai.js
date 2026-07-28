import MaxxTech from "../utils/maxxtech.js";
import Cod3Uchiha from "../utils/cod3uchiha.js";
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

        let response;
        let usedFallback = false;

        try {

            // Primary provider
            const data = await MaxxTech.request(
                "/ai/text",
                {
                    prompt,
                    model: "openai"
                }
            );

            response = data.response;

        } catch (primaryErr) {

            try {

                // Fallback provider — used automatically if the primary
                // is down, so it recovers on its own once MaxxTech is
                // stable again.
                response = await Cod3Uchiha.ask(prompt);
                usedFallback = true;

            } catch (fallbackErr) {

                return Reply.error(
                    fallbackErr.message ||
                    primaryErr.message ||
                    "AI request failed. Please try again."
                );

            }

        }

        return Reply.text(
`🤖 *Kenya-Ultra AI*

${response}

━━━━━━━━━━━━━━

🐺 Powered by Kenya-Ultra 👑${usedFallback ? " (fallback)" : ""}`
        );

    }

};
