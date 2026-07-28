import MaxxTech from "../utils/maxxtech.js";
import Reply from "../utils/reply.js";

export default {

    name: "ssweb",

    aliases: ["screenshot"],

    description: "Take a screenshot of a website.",

    category: "Tools",

    usage: ".ssweb <url>",

    async execute(message) {

        if (!message.args || !message.args.length) {

            return Reply.error(
`Please provide a website URL.

Example:
.ssweb https://example.com`
            );

        }

        const url = message.args[0];

        try {

            const s = await MaxxTech.request(
                "/ssweb",
                { url }
            );

            return Reply.image({

                url: s.screenshot,

                caption:
`📸 *Screenshot*

🔗 ${s.url}

━━━━━━━━━━━━━━

🐺 Powered by Kenya-Ultra 👑`

            });

        } catch (err) {

            return Reply.error(
                err.message || "Failed to capture screenshot."
            );

        }

    }

};
