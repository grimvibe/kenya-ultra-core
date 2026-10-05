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

// Keeps Core's copy of a session's creds fresh after the initial
// pairing. Baileys rotates identity/registration data in `creds`
// continuously — if a client's local filesystem gets wiped on
// restart (Cloud Run, Render, etc. all do this) and Core is still
// holding the day-one snapshot, WhatsApp rejects the stale creds on
// reconnect and forces a full re-pair, booting the existing session.
// This merges in the latest creds without touching stored `keys`.
export async function updateAuthCreds(sessionId, creds) {

    const existing = await loadAuth(sessionId);

    const snapshot = {
        ...(existing || {}),
        creds
    };

    await saveAuth(sessionId, snapshot);

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

/* ---------------- LAST ACTIVE (for inactivemembers) ---------------- */

export async function saveLastActive(sessionId, groupId, userId) {

    const key = `lastactive:${sessionId}:${groupId}`;

    const raw = await redisRequest(["get", key]);

    const data = raw ? JSON.parse(raw) : {};

    data[userId] = Date.now();

    await redisRequest(["set", key, JSON.stringify(data)]);

}

export async function loadLastActiveMap(sessionId, groupId) {

    const raw = await redisRequest([
        "get",
        `lastactive:${sessionId}:${groupId}`
    ]);

    return raw ? JSON.parse(raw) : {};

}

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

    return raw ? parseInt(raw, 10) : 10;

}

/* ---------------- LEVELS / XP ---------------- */

export async function loadLevelData(sessionId, groupId, userId) {

    const raw = await redisRequest([
        "get",
        `level:${sessionId}:${groupId}:${userId}`
    ]);

    if (!raw) {

        return {
            xp: 0,
            level: 0,
            lastMessageAt: 0,
            lastCommandAt: 0
        };

    }

    return JSON.parse(raw);

}

export async function saveLevelData(sessionId, groupId, userId, data) {

    await redisRequest([
        "set",
        `level:${sessionId}:${groupId}:${userId}`,
        JSON.stringify(data)
    ]);

}

export async function loadLevelSettings(sessionId, groupId) {

    const raw = await redisRequest([
        "get",
        `levelsettings:${sessionId}:${groupId}`
    ]);

    if (!raw) {
        return { announceEnabled: true };
    }

    return JSON.parse(raw);

}

export async function saveLevelSettings(sessionId, groupId, data) {

    await redisRequest([
        "set",
        `levelsettings:${sessionId}:${groupId}`,
        JSON.stringify(data)
    ]);

}

/* ---------------- SPAM BURST TRACKING ---------------- */

export async function loadRecentTimestamps(groupId, userId) {

    const raw = await redisRequest([
        "get",
        `spamwindow:${groupId}:${userId}`
    ]);

    if (!raw) return [];

    return JSON.parse(raw);

}

export async function saveRecentTimestamps(groupId, userId, timestamps) {

    await redisRequest([
        "set",
        `spamwindow:${groupId}:${userId}`,
        JSON.stringify(timestamps)
    ]);

}

/* ---------------- CHATBOT SETTINGS ---------------- */

export async function loadChatbotSettings(chatId) {

    const raw = await redisRequest([
        "get",
        `chatbot:${chatId}`
    ]);

    if (!raw) {
        return null;
    }

    return JSON.parse(raw);

}

export async function saveChatbotSettings(chatId, settings) {

    await redisRequest([
        "set",
        `chatbot:${chatId}`,
        JSON.stringify(settings)
    ]);

}

/* ---------------- COMMAND COOLDOWNS ---------------- */

export async function loadCooldown(key) {

    const raw = await redisRequest([
        "get",
        `cooldown:${key}`
    ]);

    return raw ? Number(raw) : null;

}

export async function saveCooldown(key, timestamp) {

    // Cooldowns are always short-lived (seconds), so let the key
    // expire on its own instead of accumulating forever.
    await redisRequest([
        "set",
        `cooldown:${key}`,
        String(timestamp),
        "EX",
        300
    ]);

}

/* ---------------- GROUP SETTINGS ---------------- */

export async function loadGroupSettings(groupId) {

    const raw = await redisRequest([
        "get",
        `groupsettings:${groupId}`
    ]);

    if (!raw) {
        return null;
    }

    return JSON.parse(raw);

}

export async function saveGroupSettings(groupId, settings) {

    await redisRequest([
        "set",
        `groupsettings:${groupId}`,
        JSON.stringify(settings)
    ]);

}

const DEFAULT_BOT_SETTINGS = {
    mode: "public",
    prefix: ".",
    ownerName: null,
    ownerNumber: null,
    menuImageUrl: null,
    viewOnceEmoji: null,
    autoViewStatus: false,
    autoReactStatus: false,
    autoReactStatusEmoji: "💚",
    // "off" | "groups" | "dms" | "all" — independent of one another;
    // see services/botSettingsService.js for the (lack of) coupling.
    autoTyping: "off",
    autoRecording: "off"
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
