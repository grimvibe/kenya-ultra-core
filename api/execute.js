import express from "express";
import { getCommand } from "../commands/index.js";
import { loadAuth } from "../auth/sessionStore.js";
import { getChatSettings } from "../utils/chatbotSettings.js";
import { shouldAutoReply } from "../utils/chatbotTrigger.js";
import Prexzy from "../utils/prexzy.js";
import muteService from "../services/muteService.js";

const router = express.Router();

router.post("/", async (req, res) => {

    try {

        const {
            sessionId,
            message
        } = req.body;

        if (!sessionId) {

            return res.status(400).json({
                success: false,
                message: "SESSION_ID is required."
            });

        }

        if (!message || !message.text) {

            return res.status(400).json({
                success: false,
                message: "Invalid message."
            });

        }

        // Validate SESSION_ID
        const auth = await loadAuth(sessionId);

        if (!auth) {

            return res.status(401).json({
                success: false,
                message: "Invalid SESSION_ID."
            });

        }

        const PREFIX = ".";

        // Muted users: block everything they send (commands and
        // normal chat alike), unless they're a group admin.
        if (message.isGroup && message.sender && !message.isAdmin) {

            try {

                const muted = await muteService.isMuted(
                    message.chat,
                    message.sender
                );

                if (muted) {

                    return res.json({
                        success: true,
                        action: "delete_message"
                    });

                }

            } catch (err) {

                console.error("Mute check failed:", err.message);

            }

        }

        // Non-commands: check chatbot auto-reply before ignoring
        if (!message.text.startsWith(PREFIX)) {

            try {

                const settings = await getChatSettings(message.chat);

                const eligible = shouldAutoReply({
                    settings,
                    isGroup: message.isGroup,
                    message: message.message,
                    botIds: message.botIds || []
                });

                if (eligible) {

                    const prompt = settings.persona
                        ? `${settings.persona}\n\nUser message: ${message.text}`
                        : message.text;

                    const replyText = await Prexzy.chat(prompt);

                    return res.json({
                        success: true,
                        action: "reply",
                        reply: {
                            type: "text",
                            text: replyText
                        }
                    });

                }

            } catch (err) {

                console.error("Chatbot auto-reply error:", err.message);

            }

            return res.json({
                success: true,
                ignored: true
            });

        }

        const parts = message.text
            .slice(PREFIX.length)
            .trim()
            .split(/\s+/);

        const commandName = parts.shift().toLowerCase();
        const args = parts;

        const command = getCommand(commandName);

        if (!command) {

            return res.status(404).json({
                success: false,
                message: "Unknown command."
            });

        }

        const result = await command.execute({

    sessionId,

    args,

    message: message.message,

    rawMessage: message.rawMessage,

    sock: message.sock,

    text: message.text,

    sender: message.sender,

    chat: message.chat,

    pushName: message.pushName,

    isGroup: message.isGroup,

    isAdmin: message.isAdmin || false,

    isBotAdmin: message.isBotAdmin || false,

    groupMetadata: message.groupMetadata || null

});

        return res.json(result);

    } catch (error) {

        console.error("EXECUTE API ERROR:", error);

        return res.status(500).json({

            success: false,

            message: error.message || "Internal Server Error"

        });

    }

});

export default router;
