import express from "express";
import { BufferJSON } from "baileys";
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

            // Plain Express res.json() uses ordinary JSON.stringify,
            // which does NOT know about Baileys' BufferJSON encoding
            // — real Buffer values inside `auth` would come out as
            // Node's default { type: 'Buffer', data: [...] } shape
            // instead of the base64 string form Baileys' own
            // BufferJSON.reviver expects, silently corrupting keys
            // rather than throwing. Pre-serializing here with
            // BufferJSON.replacer, and having the gateway parse this
            // exact string with BufferJSON.reviver, keeps the
            // encoding intact across the whole HTTP hop.
            authRaw: JSON.stringify(auth, BufferJSON.replacer),

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
