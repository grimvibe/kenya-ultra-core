import Reply from "../utils/reply.js";
import botSettingsService from "../services/botSettingsService.js";

export default {
    name: "botinfo",
    description: "Show information about this bot.",
    category: "General",

    async execute(message) {

        const settings = await botSettingsService.getSettings(message.sessionId);
        const ownerName = settings.ownerName || "Lucid Tech Solutions";
        const ownerLine = settings.ownerNumber
            ? `${ownerName} (${settings.ownerNumber})`
            : ownerName;

        const text = `🤖 *Kenya-Ultra*

━━━━━━━━━━━━━━

📦 Version: v1.0.0
🏗 Built with: Baileys (Node.js)
👤 Maintained by: ${ownerLine}
⚡ Runtime: Multi-session, plugin-based

━━━━━━━━━━━━━━

Type *.menu* for the full command list.

💚 Powered by Kenya-Ultra`;

        return Reply.text(text);

    }

};
