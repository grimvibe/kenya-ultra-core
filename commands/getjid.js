import Reply from "../utils/reply.js";

export default {
    name: "getjid",
    description: "Show the JID of this chat and your sender JID.",
    category: "General",

    async execute(message) {

        const text = `🆔 *JID Info*

━━━━━━━━━━━━━━

💬 Chat JID:
${message.chat}

👤 Sender JID:
${message.sender}

👥 Is Group:
${message.isGroup ? "Yes" : "No"}

━━━━━━━━━━━━━━`;

        return Reply.text(text);

    }

};
