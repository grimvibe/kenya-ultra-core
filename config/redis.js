// config/redis.js
// Reuses the same Upstash credentials already in your .env
// (UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN).

import { Redis } from "@upstash/redis";

export const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN
});
