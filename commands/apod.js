import MaxxTech from "../utils/maxxtech.js";
import Reply from "../utils/reply.js";

export default {

    name: "apod",

    aliases: ["nasa"],

    description: "NASA's Astronomy Picture of the Day.",

    category: "Tools",

    usage: ".apod",

    async execute() {

        try {

            const a = await MaxxTech.request("/nasa-apod");

            if (a.media_type !== "image") {

                return Reply.text(
`🚀 *NASA APOD — ${a.title}*

${a.explanation}

🔗 ${a.url}

━━━━━━━━━━━━━━

🐺 Powered by Kenya-Ultra 👑`
                );

            }

            return Reply.image({

                url: a.hdurl || a.url,

                caption:
`🚀 *${a.title}*

${a.explanation.slice(0, 700)}${a.explanation.length > 700 ? "…" : ""}

📸 ${a.copyright || "NASA"}

━━━━━━━━━━━━━━

🐺 Powered by Kenya-Ultra 👑`

            });

        } catch (err) {

            return Reply.error(
                err.message || "Failed to fetch APOD."
            );

        }

    }

};
