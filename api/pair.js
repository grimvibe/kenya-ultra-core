import express from "express";
import authEngine from "../auth/authEngine.js";

const router = express.Router();

router.post("/", async (req, res) => {

    try {

        const { phone } = req.body;

        if (!phone) {
            return res.status(400).json({
                success: false,
                message: "Phone number is required."
            });
        }

        const result = await authEngine.startPair(phone);

        return res.json({
            success: true,
            jobId: result.jobId,
            pairCode: result.pairCode,
            sessionId: result.sessionId
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: error.message || "Failed to generate Pair Code."
        });

    }

});

export default router;
