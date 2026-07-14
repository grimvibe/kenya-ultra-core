import express from "express";
import { generatePair } from "../auth/pairManager.js";

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

        const result = await generatePair(phone);

        res.json(result);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: "Failed to generate pair code."
        });

    }

});

export default router;
