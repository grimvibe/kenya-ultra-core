import Reply from "../utils/reply.js";
import isOwner from "../utils/isOwner.js";
import clientService from "../services/clientService.js";

export default {
    name: "stats",
    description: "Owner-only: show connected session count.",
    category: "Owner",

    async execute(message) {

        if (!isOwner(message.sender)) {
            return Reply.error("This command is restricted to the bot owner.");
        }

        const total = clientService.total();
        const sessions = clientService.onlineClients();

        const text = `📊 *Kenya-Ultra Stats*

━━━━━━━━━━━━━━

🔌 Connected sessions: ${total}

${sessions.map(id => `• ${id}`).join("\n") || "None"}

━━━━━━━━━━━━━━

💚 Powered by Kenya-Ultra`;

        return Reply.text(text);

    }

};
