import Prexzy from "../utils/prexzy.js";
import Reply from "../utils/reply.js";

export default {

    name: "gpt5",

    aliases: ["askgpt5"],

    description: "Ask AskGPT5 a question (alternate AI model).",

    category: "AI",

    usage: ".gpt5 <question>",

    async execute(message) {

        if (!message.args || !message.args.length) {

            return Reply.error(
`Please provide a question.

Example:
.gpt5 What is the capital of Kenya?`
            );

        }

        const prompt = message.args.join(" ");

        try {

            const response = await Prexzy.askgpt5(prompt);

            return Reply.text(
`🤖 *AskGPT5*

${response}

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
