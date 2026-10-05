// scripts/generateApiKey.js
// Run once per dev to mint their key:
//
//   node scripts/generateApiKey.js "Dev Name"
//
// Reads UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN from .env
// (same as the running app).

import "dotenv/config";
import crypto from "crypto";
import { redis } from "../config/redis.js";

async function main() {

    const name = process.argv[2];

    if (!name) {
        console.error("Usage: node scripts/generateApiKey.js <dev-name>");
        process.exit(1);
    }

    const key = `ku_${crypto.randomBytes(20).toString("hex")}`;

    await redis.set(`apikey:${key}`, JSON.stringify({ name, createdAt: Date.now() }));

    console.log(`API key created for "${name}":\n`);
    console.log(key);
    console.log("\nGive this to them directly — it will not be shown again.");

    process.exit(0);

}

main().catch((err) => {
    console.error("Failed to generate key:", err);
    process.exit(1);
});
