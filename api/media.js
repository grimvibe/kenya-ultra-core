import express from "express";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { assetUrl } from "../utils/assetUrl.js";

const router = express.Router();

const UPLOAD_DIR = path.join(process.cwd(), "assets", "uploads");
const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
const CLEANUP_INTERVAL_MS = 60 * 60 * 1000; // check hourly

/**
 * Deletes uploaded files older than MAX_AGE_MS. Call periodically
 * so assets/uploads doesn't grow forever.
 */
export function cleanupOldUploads() {

    if (!fs.existsSync(UPLOAD_DIR)) return;

    const now = Date.now();

    for (const filename of fs.readdirSync(UPLOAD_DIR)) {

        const filePath = path.join(UPLOAD_DIR, filename);

        try {

            const { mtimeMs } = fs.statSync(filePath);

            if (now - mtimeMs > MAX_AGE_MS) {
                fs.unlinkSync(filePath);
            }

        } catch (_) {
            // file may have been removed concurrently — ignore
        }

    }

}

// Run on startup, then on an hourly interval — self-contained here,
// nothing else needs to import or trigger this.
cleanupOldUploads();
setInterval(cleanupOldUploads, CLEANUP_INTERVAL_MS);

const EXT_FROM_MIME = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
    "video/mp4": "mp4",
    "video/3gpp": "3gp"
};

router.post("/upload", (req, res) => {

    try {

        const { data, mimetype } = req.body || {};

        if (!data) {
            return res.status(400).json({ success: false, error: "Missing file data." });
        }

        const buffer = Buffer.from(data, "base64");

        // 20MB cap to keep Core's own storage from growing unbounded
        if (buffer.length > 20 * 1024 * 1024) {
            return res.status(413).json({ success: false, error: "File too large (max 20MB)." });
        }

        if (!fs.existsSync(UPLOAD_DIR)) {
            fs.mkdirSync(UPLOAD_DIR, { recursive: true });
        }

        const ext = EXT_FROM_MIME[mimetype] || "bin";
        const filename = `${uuidv4()}.${ext}`;

        fs.writeFileSync(path.join(UPLOAD_DIR, filename), buffer);

        return res.status(200).json({
            success: true,
            url: assetUrl(`uploads/${filename}`)
        });

    } catch (error) {

        return res.status(500).json({ success: false, error: error.message });

    }

});

export default router;
