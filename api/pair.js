import express from "express";
import authEngine from "../auth/authEngine.js";

const router = express.Router();

router.post("/", async (req, res) => {

    console.log("\n==============================");
    console.log("📱 New Pair Request Received");
    console.log("==============================");

    try {

        let { phone } = req.body;

        if (!phone) {

            console.log("❌ Phone number missing.");

            return res.status(400).json({
                success: false,
                message: "Phone number is required."
            });

        }

        phone = phone.replace(/\D/g, "");

        console.log("📞 Phone:", phone);

        if (phone.length < 10) {

            console.log("❌ Invalid phone number.");

            return res.status(400).json({
                success: false,
                message: "Invalid phone number."
            });

        }

        console.log("🚀 Starting pairing process...");

        const result = await authEngine.startPair(phone);

        console.log("✅ Pair Code Generated:", result.pairCode);

        return res.status(200).json({
            success: true,
            message: "Pair code generated successfully.",
            jobId: result.jobId,
            pairCode: result.pairCode,
            sessionId: result.sessionId || null
        });

    } catch (error) {

        console.error("❌ PAIR API ERROR");
        console.error(error);

        return res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error"
        });

    }

});

export default router;
