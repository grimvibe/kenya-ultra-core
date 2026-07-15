import express from "express";
import authEngine from "../auth/authEngine.js";

const router = express.Router();

router.post("/", async (req, res) => {

    try {

        let { phone } = req.body;

        if (!phone) {

            return res.status(400).json({
                success: false,
                message: "Phone number is required."
            });

        }

        phone = phone.replace(/\D/g, "");

        if (phone.length < 10) {

            return res.status(400).json({
                success: false,
                message: "Invalid phone number."
            });

        }

        const result = await authEngine.startPair(phone);

        return res.status(200).json({

            success: true,

            message: "Pair code generated successfully.",

            jobId: result.jobId,

            pairCode: result.pairCode

        });

    } catch (error) {

        console.error("PAIR API ERROR:", error);

        return res.status(500).json({

            success: false,

            message: error.message || "Internal Server Error"

        });

    }

});

export default router;
