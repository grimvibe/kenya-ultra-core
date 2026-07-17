import express from "express";
import clientService from "../services/clientService.js";

const router = express.Router();

router.post("/", async (req, res) => {

    try {

        const { sessionId } = req.body;

        if (!sessionId) {

            return res.status(400).json({
                success: false,
                message: "SESSION_ID is required."
            });

        }

        const creds = await clientService.decode(sessionId);

        return res.json({
            success: true,
            creds
        });

    } catch (error) {

        console.error("DECODE API ERROR:", error);

        return res.status(500).json({
            success: false,
            message: error.message || "Failed to decode SESSION_ID."
        });

    }

});

export default router;
