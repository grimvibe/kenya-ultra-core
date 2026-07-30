import express from "express";
import { loadAuth } from "../auth/sessionStore.js";
import botSettingsService from "../services/botSettingsService.js";

const router = express.Router();

router.get("/:sessionId", async (req, res) => {

    try {

        const { sessionId } = req.params;

        const auth = await loadAuth(sessionId);

        if (!auth) {

            return res.status(401).json({
                success: false,
                message: "Invalid SESSION_ID."
            });

        }

        const settings = await botSettingsService.getSettings(sessionId);

        return res.json({
            success: true,
            ...settings
        });

    } catch (error) {

        console.error("SETTINGS API ERROR:", error);

        return res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error"
        });

    }

});

export default router;
