import express from "express";
import clientService from "../services/clientService.js";

const router = express.Router();

// Optional/best-effort — a clean shutdown calls this, but most real
// disconnects (crashes, force-stops, OOM kills) never get the chance
// to. That's fine: runtimeManager's own staleness check (see
// runtime/runtimeManager.js) prunes sessions that stop heartbeating
// via /connect regardless of whether this ever fires.
router.post("/", async (req, res) => {

    try {

        const { sessionId } = req.body;

        if (!sessionId) {

            return res.status(400).json({
                success: false,
                message: "SESSION_ID is required."
            });

        }

        const result = clientService.disconnect(sessionId);

        return res.json(result);

    } catch (error) {

        console.error("DISCONNECT API ERROR:", error);

        return res.status(500).json({
            success: false,
            message: error.message || "Failed to register disconnection."
        });

    }

});

export default router;
