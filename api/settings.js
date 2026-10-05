import express from "express";
import { loadAuth } from "../auth/sessionStore.js";
import botSettingsService from "../services/botSettingsService.js";
import { getGroupSettings } from "../settings/settingsStore.js";

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

// Read-only group-level settings (anti-* features, welcome/goodbye,
// autoapprove/autoreject). Used by the gateway for event-driven
// features that don't originate from a chat message — join requests,
// message edits/deletes, participant joins/leaves — so it can check
// whether a feature is enabled without going through /execute.
router.get("/group/:groupId", async (req, res) => {

    try {

        const settings = await getGroupSettings(req.params.groupId);

        return res.json({
            success: true,
            settings
        });

    } catch (error) {

        console.error("GROUP SETTINGS API ERROR:", error);

        return res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error"
        });

    }

});

export default router;
