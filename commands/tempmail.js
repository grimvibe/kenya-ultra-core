import MaxxTech from "../utils/maxxtech.js";
import Reply from "../utils/reply.js";

export default {

    name: "tempmail",

    aliases: ["tempemail"],

    description: "Generate a temporary email address, or check its inbox. Usage: .tempmail | .tempmail check <email>",

    category: "Tools",

    usage: ".tempmail",

    async execute(message) {

        const args = message.args || [];

        // ==========================
        // Check inbox
        // ==========================

        if (args[0]?.toLowerCase() === "check") {

            const email = args[1];

            if (!email) {

                return Reply.error(
`Please provide the email to check.

Example:
.tempmail check tbfska4a@1secmail.com`
                );

            }

            try {

                const i = await MaxxTech.request(
                    "/tempgen/inbox",
                    { email }
                );

                let text =
`📬 *Inbox: ${i.email}*

`;

                if (i.messages?.length) {

                    for (const m of i.messages) {

                        text +=
`✉️ From: ${m.from}
${m.subject || m.text || ""}

`;

                    }

                } else {

                    text += "No messages found from here yet.\n\n";

                }

                text += `🌐 View live: ${i.inbox_web}`;

                return Reply.text(text.trim());

            } catch (err) {

                return Reply.error(
                    err.message || "Failed to check inbox."
                );

            }

        }

        // ==========================
        // Generate new address
        // ==========================

        try {

            const e = await MaxxTech.request(
                "/tempgen/email",
                { mode: "random" }
            );

            return Reply.text(
`📧 *Temporary Email Generated*

${e.email}

To check messages sent here, use:
.tempmail check ${e.email}

🌐 Or view live: ${e.inbox}`
            );

        } catch (err) {

            return Reply.error(
                err.message || "Failed to generate a temporary email."
            );

        }

    }

};
