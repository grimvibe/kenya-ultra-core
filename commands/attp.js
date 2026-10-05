import Reply from "../utils/reply.js";
import NexOracle from "../utils/nexoracle.js";

export default {

    name: "attp",

    aliases: ["attp2"],

    description: "Create an animated text-to-picture sticker/image.",

    category: "Media",

    usage: ".attp <text>",

    async execute(message) {

        if (!message.args || !message.args.length) {

            return Reply.error(
`Please provide text.

Example:
.attp Kenya Ultra`
            );

        }

        const text = message.args.join(" ");

        const path = message.commandName === "attp2"
            ? "/image-creating/attp2"
            : "/image-creating/attp";

        const url = NexOracle.buildUrl(path, { text });

        return Reply.image({
            url,
            caption:
`✨ *Animated Text*

🐺 Powered by Kenya-Ultra 👑`
        });

    }

};
