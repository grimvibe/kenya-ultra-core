import {
    loadLevelData,
    saveLevelData,
    loadLevelSettings,
    saveLevelSettings
} from "../auth/sessionStore.js";

// =========================
// XP / Level configuration
// =========================
//
// XP needed to go from `level` -> `level + 1`. Same curve MEE6-style
// Discord bots use, just ported over: gets steeper as level rises.
function xpForNextLevel(level) {
    return 5 * level * level + 50 * level + 100;
}

// Message XP: awarded on any message in a group, rate-limited so
// people can't spam-level. Command XP: awarded per command run, on
// its own shorter cooldown, since running a command is intentional
// engagement rather than chat spam.
const MESSAGE_XP_MIN = 15;
const MESSAGE_XP_MAX = 25;
const MESSAGE_COOLDOWN_MS = 60 * 1000;

const COMMAND_XP = 8;
const COMMAND_COOLDOWN_MS = 15 * 1000;

const RANKS = [
    { minLevel: 50, name: "Legend" },
    { minLevel: 35, name: "Elite" },
    { minLevel: 20, name: "Veteran" },
    { minLevel: 10, name: "Regular" },
    { minLevel: 5, name: "Active" },
    { minLevel: 0, name: "Newbie" }
];

export function getRank(level) {
    return RANKS.find(r => level >= r.minLevel).name;
}

function randomXp() {
    return Math.floor(
        Math.random() * (MESSAGE_XP_MAX - MESSAGE_XP_MIN + 1)
    ) + MESSAGE_XP_MIN;
}

// Applies XP gain(s) to a user's stored data, rolling levels forward
// as many times as the new total supports (in case of a big jump).
function applyXp(data, amount) {

    data.xp += amount;

    let leveledUp = false;
    let needed = xpForNextLevel(data.level);

    while (data.xp >= needed) {
        data.xp -= needed;
        data.level += 1;
        leveledUp = true;
        needed = xpForNextLevel(data.level);
    }

    return leveledUp;
}

/**
 * Award XP for an incoming message + (optionally) a command run in
 * the same turn. Both are cooldown-gated independently. Returns the
 * updated record plus whether a level-up happened this call.
 */
export async function trackActivity({
    sessionId,
    groupId,
    userId,
    isCommand
}) {

    if (!sessionId || !groupId || !userId) {
        return null;
    }

    const data = await loadLevelData(sessionId, groupId, userId);
    const now = Date.now();

    let leveledUp = false;
    let gained = 0;

    if (now - (data.lastMessageAt || 0) >= MESSAGE_COOLDOWN_MS) {
        const amount = randomXp();
        gained += amount;
        if (applyXp(data, amount)) leveledUp = true;
        data.lastMessageAt = now;
    }

    if (
        isCommand &&
        now - (data.lastCommandAt || 0) >= COMMAND_COOLDOWN_MS
    ) {
        gained += COMMAND_XP;
        if (applyXp(data, COMMAND_XP)) leveledUp = true;
        data.lastCommandAt = now;
    }

    if (gained === 0) {
        // Nothing to persist, cooldowns absorbed everything.
        return { data, leveledUp: false, gained: 0 };
    }

    await saveLevelData(sessionId, groupId, userId, data);

    return { data, leveledUp, gained };

}

export async function getLevelInfo(sessionId, groupId, userId) {

    const data = await loadLevelData(sessionId, groupId, userId);

    return {
        xp: data.xp,
        level: data.level,
        rank: getRank(data.level),
        xpForNext: xpForNextLevel(data.level),
        totalExp: cumulativeXp(data.level, data.xp)
    };

}

// "Total EXP" as shown on the card is cumulative across all levels,
// not just the remainder in the current level.
function cumulativeXp(level, remainder) {

    let total = remainder;

    for (let l = 0; l < level; l++) {
        total += xpForNextLevel(l);
    }

    return total;

}

export async function isAnnounceEnabled(sessionId, groupId) {
    const settings = await loadLevelSettings(sessionId, groupId);
    return settings.announceEnabled !== false;
}

export async function setAnnounceEnabled(sessionId, groupId, enabled) {
    await saveLevelSettings(sessionId, groupId, { announceEnabled: enabled });
}
