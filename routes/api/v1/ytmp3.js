// routes/api/v1/ytmp3.js
import express from "express";
import apiKeyAuth from "../../../middleware/apiKeyAuth.js";
import { downloadAsMp3, cleanupFile } from "../../../utils/ytdlp.js";

const router = express.Router();

// POST /api/v1/ytmp3
// Headers: x-api-key: <key>
// Body: { "url": "https://youtube.com/watch?v=..." }
// Response: streams the mp3 file directly (Content-Disposition: attachment)
router.post("/ytmp3", apiKeyAuth, async (req, res) => {

    const { url } = req.body || {};

    if (!url) {
        return res.status(400).json({ status: "error", message: 'Missing "url" in request body' });
    }

    let filePath;

    try {

        filePath = await downloadAsMp3(url);

        res.download(filePath, "audio.mp3", (err) => {
            cleanupFile(filePath);
            if (err) console.error("[ytmp3] send error:", err.message);
        });

    } catch (err) {

        if (filePath) cleanupFile(filePath);
        console.error("[ytmp3] error:", err.message);
        res.status(500).json({ status: "error", message: "Failed to convert video", detail: err.message });

    }

});

export default router;
