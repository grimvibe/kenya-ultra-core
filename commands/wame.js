import Reply from "../utils/reply.js";

const SUPPORT_LINK = "https://wa.me/254754938511";

export default {
    name: "wame",
    description: "Generate a wa.me chat link. Usage: .wame 2547XXXXXXXX [optional prefilled text]",
    category: "Utility",

    async execute(message) {

        const args = message.args || [];

        if (!args.length) {
            return Reply.error("Provide a phone number. Example: .wame 254712345678 Hello there!");
        }

        const phone = args[0].replace(/\D/g, "");

        if (!phone || phone.length < 9) {
            return Reply.error("That doesn't look like a valid phone number. Include the country code, e.g. 254712345678.");
        }

        const presetText = args.slice(1).join(" ");

        let link = `https://wa.me/${phone}`;

        if (presetText) {
            link += `?text=${encodeURIComponent(presetText)}`;
        }

        const text = `🔗 *WhatsApp Link*

${link}

━━━━━━━━━━━━━━

💬 Message Lucid Tech Solutions on WhatsApp
${SUPPORT_LINK}`;

        return Reply.text(text);

    }

};
            
