import Reply from "../utils/reply.js";
import NexOracle from "../utils/nexoracle.js";

export default {

    name: "quotesmaker",

    aliases: ["quotemaker"],

    description: "Create an aesthetic quote card image.",

    category: "Media",

    usage: ".quotesmaker <quote text> | <author>",

    async execute(message) {

        if (!message.args || !message.args.length) {

            return Reply.error(
`Please provide quote text and an author, separated by |.

Example:
.quotesmaker Stay hungry, stay foolish | Steve Jobs`
            );

        }

        const raw = message.args.join(" ");
        const [text1, text2] = raw.split("|").map(s => s?.trim());

        if (!text1) {
            return Reply.error("Please provide the quote text.");
        }

        const url = NexOracle.buildUrl("/image-creating/quotes-maker", {
            text1,
            text2: text2 || "Unknown"
        });

        return Reply.image({
            url,
            caption:
`💭 *Quote Card*

🐺 Powered by Kenya-Ultra 👑`
        });

    }

};
