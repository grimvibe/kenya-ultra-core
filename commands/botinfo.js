import Reply from "../utils/reply.js";

export default {
    name: "botinfo",
    description: "Show information about this bot.",
    category: "General",

    async execute(message) {

        const text = `🤖 *Kenya-Ultra*

━━━━━━━━━━━━━━

📦 Version: v1.0.0
🏗 Built with: Baileys (Node.js)
👤 Maintained by: Lucid Tech Solutions
⚡ Runtime: Multi-session, plugin-based

━━━━━━━━━━━━━━

Type *.menu* for the full command list.

💚 Powered by Kenya-Ultra`;

        return Reply.text(text);

    }

};
