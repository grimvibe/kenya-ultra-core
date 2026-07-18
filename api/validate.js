import express from "express";
import { loadAuth } from "../auth/sessionStore.js";

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

        const auth = await loadAuth(sessionId);

        if (!auth) {

            return res.status(401).json({
                success: false,
                message: "Invalid SESSION_ID."
            });

        }

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
