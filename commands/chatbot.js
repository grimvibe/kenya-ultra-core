import { getChatSettings, setChatSettings } from "../utils/chatbotSettings.js";
import { MODES } from "../utils/chatbotTrigger.js";
import Reply from "../utils/reply.js";

export default {

    name: "chatbot",

    description: "Configure AI auto-reply for this chat.",

    category: "AI",

    usage: ".chatbot on|off|status|persona",

    async execute(message) {

        const args = message.args || [];
        const sub = args[0]?.toLowerCase();
        const chatId = message.chat;

        if (sub === "on") {

            const mode = args[1]?.toLowerCase();

            if (message.isGroup) {

                if (!mode || !MODES.includes(mode)) {

                    return Reply.text(
`⚠️ Please specify a mode for group chatbot mode:

.chatbot on all — reply to every message
.chatbot on mention — reply only when @tagged
.chatbot on reply — reply only when someone replies to the bot's message`
                    );

                }

                await setChatSettings(chatId, { enabled: true, mode });

                return Reply.text(
                    `🤖 Chatbot enabled for this group (mode: *${mode}*).`
                );

            }

            await setChatSettings(chatId, { enabled: true, mode: "all" });

            return Reply.text("🤖 Chatbot enabled for this DM.");

        }

        if (sub === "off") {

            await setChatSettings(chatId, { enabled: false });

            return Reply.text("🤖 Chatbot disabled for this chat.");

        }

        if (sub === "status") {

            const s = await getChatSettings(chatId);

            return Reply.text(
`🤖 *Chatbot Status*

Enabled: ${s.enabled ? "✅ Yes" : "❌ No"}
Mode: ${s.mode}
Persona: ${s.persona ? s.persona : "Default (generic AI tone)"}`
            );

        }

        if (sub === "persona") {

            const sub2 = args[1]?.toLowerCase();

            if (sub2 === "reset") {

                await setChatSettings(chatId, { persona: null });

                return Reply.text("🤖 Persona reset to default tone for this chat.");

            }

            const personaText = args.slice(1).join(" ");

            if (!personaText) {

                return Reply.error(
`Please provide persona instructions, or 'reset'.

Example:
.chatbot persona You are Lawrence, reply casually and briefly like texting a friend.`
                );

            }

            await setChatSettings(chatId, { persona: personaText });

            return Reply.text("🤖 Persona updated for this chat.");

        }

        return Reply.text(
`🤖 *Chatbot Commands*

.chatbot on — enable (DMs)
.chatbot on all|mention|reply — enable (groups)
.chatbot off — disable for this chat
.chatbot status — show current settings
.chatbot persona <instructions> — set a custom tone
.chatbot persona reset — back to default tone`
        );

    }

};
