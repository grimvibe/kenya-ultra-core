import express from "express";
import { decodeSession } from "../utils/sessionEncoder.js";

const router = express.Router();

router.post("/", async (req, res) => {

    try {

        const { sessionId } = req.body;

        if (!sessionId) {

            return res.status(400).json({
                success: false,
                valid: false,
                message: "SESSION_ID is required."
            });

        }

        const creds = decodeSession(sessionId);

        return res.status(200).json({

            success: true,
            valid: true,
            message: "SESSION_ID verified successfully.",

            client: {
                id: creds.me?.id || null,
                name: creds.me?.name || null
            },

            runtime: {
                auth: creds
            }

        });

    } catch (error) {

        console.error("SESSION VALIDATION ERROR:", error);

        return res.status(401).json({

            success: false,
            valid: false,
            message: "Invalid SESSION_ID."

        });

    }

});

export default router;
