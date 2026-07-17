import express from "express";
import { getCommand } from "../commands/index.js";
import { decodeSession } from "../utils/sessionEncoder.js";

const router = express.Router();

router.post("/", async (req, res) => {

    try {

        const {
            sessionId,
            command,
            args = []
        } = req.body;

        if (!sessionId) {
            return res.status(400).json({
                success: false,
                message: "SESSION_ID is required."
            });
        }

        if (!command) {
            return res.status(400).json({
                success: false,
                message: "Command is required."
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

        // Find command
        const cmd = getCommand(command);

        if (!cmd) {
            return res.status(404).json({
                success: false,
                message: "Command not found."
            });
        }

        // Execute command
        const result = await cmd.execute({
            args,
            sessionId
        });

        return res.json({
            success: true,
            command: cmd.name,
            result
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
