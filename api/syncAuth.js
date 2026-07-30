import express from "express";
import { loadAuth, updateAuthCreds } from "../auth/sessionStore.js";

const router = express.Router();

router.post("/", async (req, res) => {

    try {

        const { sessionId, creds } = req.body;

        if (!sessionId || !creds) {

            return res.status(400).json({
                success: false,
                message: "sessionId and creds are required."
            });

        }

        const existing = await loadAuth(sessionId);

        if (!existing) {

            return res.status(401).json({
                success: false,
                message: "Invalid SESSION_ID."
            });

        }

        await updateAuthCreds(sessionId, creds);

        return res.json({ success: true });

    } catch (error) {

        console.error("SYNC-AUTH API ERROR:", error);

        return res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error"
        });

    }

});

export default router;
