// routes/api/v1/ytmp4.js
import express from "express";
import apiKeyAuth from "../../../middleware/apiKeyAuth.js";
import { downloadAsMp4, cleanupFile } from "../../../utils/ytdlp.js";

const router = express.Router();

// POST /api/v1/ytmp4
// Headers: x-api-key: <key>
// Body: { "url": "https://youtube.com/watch?v=..." }
// Response: streams the mp4 file directly (Content-Disposition: attachment)
router.post("/ytmp4", apiKeyAuth, async (req, res) => {

    const { url } = req.body || {};

    if (!url) {
        return res.status(400).json({ status: "error", message: 'Missing "url" in request body' });
    }

    let filePath;

    try {

        filePath = await downloadAsMp4(url);

        res.download(filePath, "video.mp4", (err) => {
            cleanupFile(filePath);
            if (err) console.error("[ytmp4] send error:", err.message);
        });

    } catch (err) {

        if (filePath) cleanupFile(filePath);
        console.error("[ytmp4] error:", err.message);
        res.status(500).json({ status: "error", message: "Failed to convert video", detail: err.message });

    }

});

export default router;
