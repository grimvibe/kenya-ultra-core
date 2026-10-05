import express from "express";
import clientService from "../services/clientService.js";
import { loadAuth } from "../auth/sessionStore.js";

const router = express.Router();

// Called by the public bot client once on a successful WhatsApp
// connection, then periodically as a heartbeat (see index.js's
// connection.update "open" handler + the interval it sets up). This
// is what powers .stats' "connected sessions" count — previously
// nothing ever told Core a session existed, so it always read 0
// regardless of how many bots were actually online.
router.post("/", async (req, res) => {

    try {

        const { sessionId } = req.body;

        if (!sessionId) {

            return res.status(400).json({
                success: false,
                message: "SESSION_ID is required."
            });

        }

        const auth = await loadAuth(sessionId);

        if (!auth) {

            return res.status(401).json({
                success: false,
                message: "Invalid SESSION_ID."
            });

        }

        const result = clientService.connect(sessionId);

        return res.json(result);

    } catch (error) {

        console.error("CONNECT API ERROR:", error);

        return res.status(500).json({
            success: false,
            message: error.message || "Failed to register connection."
        });

    }

});

export default router;
