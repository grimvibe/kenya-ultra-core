import axios from "axios";
import { BufferJSON } from "baileys";

const REST_URL = process.env.UPSTASH_REDIS_REST_URL;
const REST_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

if (!REST_URL || !REST_TOKEN) {
    throw new Error(
        "UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN must be set."
    );
}

const client = axios.create({
    baseURL: REST_URL,
    headers: {
        Authorization: `Bearer ${REST_TOKEN}`
    },
    timeout: 10000
});

async function redisRequest(command) {

    const path = "/" + command.map(encodeURIComponent).join("/");

    const { data } = await client.get(path);

    if (data.error) {
        throw new Error(data.error);
    }

    return data.result;

}

/* ---------------- SESSION ---------------- */

export async function saveAuth(sessionId, snapshot) {

    await redisRequest([
        "set",
        `session:${sessionId}`,
        JSON.stringify(snapshot, BufferJSON.replacer)
    ]);

}

export async function loadAuth(sessionId) {

    const raw = await redisRequest([
        "get",
        `session:${sessionId}`
    ]);

    if (!raw) return null;

    return JSON.parse(raw, BufferJSON.reviver);

}

export async function deleteAuth(sessionId) {

    await redisRequest([
        "del",
        `session:${sessionId}`
    ]);

}

/* ---------------- WARNINGS ---------------- */

export async function saveWarn(groupId, userId, data) {

    await redisRequest([
        "set",
        `warn:${groupId}:${userId}`,
        JSON.stringify(data)
    ]);

}

export async function loadWarn(groupId, userId) {

    const raw = await redisRequest([
        "get",
        `warn:${groupId}:${userId}`
    ]);

    if (!raw) {

        return {
            count: 0,
            reasons: []
        };

    }

    return JSON.parse(raw);

}

export async function deleteWarn(groupId, userId) {

    await redisRequest([
        "del",
        `warn:${groupId}:${userId}`
    ]);

}

/* ---------------- MUTES ---------------- */

export async function saveMuteList(groupId, data) {

    await redisRequest([
        "set",
        `mute:${groupId}`,
        JSON.stringify(data)
    ]);

}

export async function loadMuteList(groupId) {

    const raw = await redisRequest([
        "get",
        `mute:${groupId}`
    ]);

    if (!raw) return {};

    return JSON.parse(raw);

}

export async function deleteMuteList(groupId) {

    await redisRequest([
        "del",
        `mute:${groupId}`
    ]);

}

/* ---------------- MENU STYLE ---------------- */

export async function saveMenuStyle(sessionId, userId, style) {

    await redisRequest([
        "set",
        `menustyle:${sessionId}:${userId}`,
        String(style)
    ]);

}

export async function loadMenuStyle(sessionId, userId) {

    const raw = await redisRequest([
        "get",
        `menustyle:${sessionId}:${userId}`
    ]);

    return raw ? parseInt(raw, 10) : 1;

}

const DEFAULT_BOT_SETTINGS = {
    mode: "public",
    prefix: "."
};

export async function saveBotSettings(sessionId, data) {

    await redisRequest([
        "set",
        `botsettings:${sessionId}`,
        JSON.stringify(data)
    ]);

}

export async function loadBotSettings(sessionId) {

    const raw = await redisRequest([
        "get",
        `botsettings:${sessionId}`
    ]);

    if (!raw) {
        return { ...DEFAULT_BOT_SETTINGS };
    }

    return { ...DEFAULT_BOT_SETTINGS, ...JSON.parse(raw) };

}
