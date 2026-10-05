import Prexzy from "../utils/prexzy.js";
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
            response = await Prexzy.ask(prompt);

        } catch (primaryErr) {

            try {

                // 2nd tier — a different provider entirely, recovers
                // on its own once Prexzy is stable again.
                response = await Cod3Uchiha.ask(prompt);
                usedFallback = true;

            } catch (secondaryErr) {

                try {

                    // 3rd tier — a different endpoint on Prexzy's own
                    // API. Worth trying since individual Prexzy routes
                    // have gone down independently of each other before
                    // (chateverywhere/aichat failing while other
                    // /ai/* routes stayed up).
                    response = await Prexzy.deepQuery(prompt);
                    usedFallback = true;

                } catch (tertiaryErr) {

                    return Reply.error(
                        tertiaryErr.message ||
                        secondaryErr.message ||
                        primaryErr.message ||
                        "AI request failed. Please try again."
                    );

                }

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
