// middleware/apiKeyAuth.js
// Checks x-api-key against Redis. Keys are created with
// scripts/generateApiKey.js and stored as apikey:<key> -> { name, createdAt }

import { redis } from "../config/redis.js";

export default async function apiKeyAuth(req, res, next) {

    const key = req.header("x-api-key");

    if (!key) {
        return res.status(401).json({ status: "error", message: "Missing x-api-key header" });
    }

    try {

        const raw = await redis.get(`apikey:${key}`);

        if (!raw) {
            return res.status(403).json({ status: "error", message: "Invalid API key" });
        }

        const data = typeof raw === "string" ? JSON.parse(raw) : raw;
        req.apiKeyOwner = data.name;

        // usage counter, non-blocking
        redis.incr(`apikey:${key}:count`).catch(() => {});

        next();

    } catch (err) {

        console.error("[apiKeyAuth] error:", err);
        res.status(500).json({ status: "error", message: "Auth check failed" });

    }

}
