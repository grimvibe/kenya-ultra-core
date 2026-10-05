import Reply from "../utils/reply.js";
import NexOracle from "../utils/nexoracle.js";

export default {

    name: "ttp2",

    aliases: ["ttp6"],

    description: "Create a text-to-picture styled image.",

    category: "Media",

    usage: ".ttp2 <text>",

    async execute(message) {

        if (!message.args || !message.args.length) {

            return Reply.error(
`Please provide text.

Example:
.ttp2 Kenya Ultra`
            );

        }

        const text = message.args.join(" ");

        const path = message.commandName === "ttp6"
            ? "/image-creating/ttp6"
            : "/image-creating/ttp2";

        const url = NexOracle.buildUrl(path, { text });

        return Reply.image({
            url,
            caption:
`✨ *Text Image*

🐺 Powered by Kenya-Ultra 👑`
        });

    }

};
