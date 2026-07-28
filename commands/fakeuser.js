import MaxxTech from "../utils/maxxtech.js";
import Reply from "../utils/reply.js";

export default {

    name: "fakeuser",

    aliases: ["randomuser"],

    description: "Generate a random fake identity.",

    category: "Tools",

    usage: ".fakeuser",

    async execute() {

        try {

            const u = await MaxxTech.request("/fake-user");

            return Reply.image({

                url: u.picture,

                caption:
`👤 *${u.title} ${u.name}*

📧 ${u.email}
📞 ${u.phone}
🌍 ${u.address}
🎂 Age: ${u.age}
🆔 Username: ${u.username}

━━━━━━━━━━━━━━

🐺 Powered by Kenya-Ultra 👑`

            });

        } catch (err) {

            return Reply.error(
                err.message || "Failed to generate fake user."
            );

        }

    }

};
