import express from "express";
import { getCommand } from "../commands/index.js";
import { decodeSession } from "../utils/sessionEncoder.js";

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
        try {

            decodeSession(sessionId);

        } catch {

            return res.status(401).json({
                success: false,
                message: "Invalid SESSION_ID."
            });

        }

        const PREFIX = ".";

        if (!message.text.startsWith(PREFIX)) {

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

        const reply = await command.execute({

            sessionId,

            args,

            message,

            sender: message.sender,

            chat: message.chat,

            pushName: message.pushName,

            isGroup: message.isGroup

        });

        return res.json({

            success: true,

            reply

        });

    } catch (error) {

        console.error("EXECUTE API ERROR:", error);

        return res.status(500).json({

            success: false,

            message: error.message || "Internal Server Error"

        });

    }

});

export default router;
