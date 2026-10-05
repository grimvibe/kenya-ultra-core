import authEngine from "../auth/authEngine.js";
import Reply from "../utils/reply.js";

export default {

    name: "pair",

    description: "Generate a WhatsApp pairing code for a phone number without visiting the website.",

    category: "Owner",

    usage: ".pair <phone number with country code>",

    async execute(ctx) {

        const { isBotOwner, args } = ctx;

        if (!isBotOwner)
            return Reply.error("This command is restricted to the bot owner.");

        const rawPhone = (args || []).join("").trim();

        if (!rawPhone)
            return Reply.error("Provide a phone number.\nExample:\n.pair 2547XXXXXXXX");

        const phone = rawPhone.replace(/\D/g, "");

        if (phone.length < 10)
            return Reply.error("That doesn't look like a valid phone number. Include the country code, e.g. 2547XXXXXXXX.");

        try {

            const result = await authEngine.startPair(phone);

            return Reply.text(
`╭⊷ 🔗 *PAIRING CODE*

│

├⊷ 📱 *Number:* ${phone}

├⊷ 🔑 *Code:* ${result.pairCode}

│

├⊷ Enter this code in WhatsApp:
│  Linked devices → Link with phone number

│

╰⊷ 🐺 *Kenya-Ultra*`
            );

        } catch (error) {

            return Reply.error(`Failed to generate a pairing code: ${error.message || "Unknown error"}`);

        }

    }

};
