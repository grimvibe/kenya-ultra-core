import Reply from "../utils/reply.js";

export default {
    name: "owner",
    description: "Show contact details for the bot owner.",
    category: "General",

    async execute(message) {

        const info = `👤 *Bot Owner*

━━━━━━━━━━━━━━

Lucid Tech Solutions

📦 Kenya-Ultra v1.0.0
💚 Powered by Kenya-Ultra

━━━━━━━━━━━━━━

For support or business inquiries, reach out through the number registered to this bot.`;

        return Reply.text(info);

    }

};
