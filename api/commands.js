import express from "express";
import path from "path";
import archiver from "archiver";

const router = express.Router();

// Public bots hit this on boot to pull the current command set.
router.get("/download", (req, res) => {

    res.attachment("kenya-ultra-commands.zip");

    const archive = archiver("zip", { zlib: { level: 9 } });

    archive.on("error", (err) => {
        console.error("Commands zip error:", err);
        if (!res.headersSent) {
            res.status(500).json({ success: false, message: "Failed to bundle commands." });
        }
    });

    archive.pipe(res);

    // Bundles the whole commands/ folder as-is, so command files can
    // reference each other via relative imports if needed later.
    archive.directory(path.join(process.cwd(), "commands"), "commands");

    archive.finalize();

});

export default router;
