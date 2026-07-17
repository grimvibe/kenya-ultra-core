import express from "express";
import { decodeSession } from "../utils/sessionEncoder.js";

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

        const auth = decodeSession(sessionId);

        return res.status(200).json({

            success: true,

            auth,

            client: {
                id: auth.creds?.me?.id || null,
                name: auth.creds?.me?.name || null
            }

        });

    } catch (error) {

        console.error("SESSION VALIDATION ERROR:", error);

        return res.status(401).json({

            success: false,
            message: "Invalid SESSION_ID."

        });

    }

});

export default router;
