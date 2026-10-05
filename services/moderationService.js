import { getGroupSettings } from "../settings/settingsStore.js";
import {
    loadRecentTimestamps,
    saveRecentTimestamps
} from "../auth/sessionStore.js";
import warnService from "./warnService.js";
import {
    hasLink,
    containsBadWord,
    isEmojiHeavy,
    isSaleSpam,
    isBegging,
    hasPhoneNumberSpam,
    getMentionedJids,
    isForwarded,
    getMessageType
} from "../utils/moderation.js";

const WARN_LIMIT = 3;

// Threshold for a "mass tag" (antitag) vs. an ordinary @mention
// (antimention, which fires on any mention at all).
const MASS_TAG_THRESHOLD = 5;

// antispam: more than this many messages within the window = burst.
const SPAM_WINDOW_MS = 8000;
const SPAM_MESSAGE_LIMIT = 6;

async function isSpamBurst(groupId, userId) {

    const now = Date.now();

    let timestamps = await loadRecentTimestamps(groupId, userId);

    timestamps = timestamps.filter(t => now - t < SPAM_WINDOW_MS);
    timestamps.push(now);

    await saveRecentTimestamps(groupId, userId, timestamps);

    return timestamps.length > SPAM_MESSAGE_LIMIT;

}

// Ordered list of checks. First enabled + matching feature wins —
// only one violation is ever acted on per message.
async function detectViolation(ctx, settings) {

    const text = ctx.text || "";
    const msg = ctx.message;

    if (
        settings.antilink?.enabled &&
        !ctx.isCommand &&
        hasLink(text)
    ) {
        return { key: "antilink", label: "links" };
    }

    if (settings.antibadword?.enabled && containsBadWord(text)) {
        return { key: "antibadword", label: "bad language" };
    }

    if (
        settings.antispam?.enabled &&
        (await isSpamBurst(ctx.chat, ctx.sender))
    ) {
        return { key: "antispam", label: "spamming" };
    }

    if (settings.antiemoji?.enabled && isEmojiHeavy(text)) {
        return { key: "antiemoji", label: "excessive emojis" };
    }

    const mentioned = getMentionedJids(msg);

    if (
        settings.antitag?.enabled &&
        mentioned.length > MASS_TAG_THRESHOLD
    ) {
        return { key: "antitag", label: "mass tagging" };
    }

    if (settings.antimention?.enabled && mentioned.length > 0) {
        return { key: "antimention", label: "mentioning members" };
    }

    const type = getMessageType(msg);

    if (settings.antisticker?.enabled && type === "sticker") {
        return { key: "antisticker", label: "stickers" };
    }

    if (settings.antivoice?.enabled && type === "ptt") {
        return { key: "antivoice", label: "voice notes" };
    }

    if (settings.antifile?.enabled && type === "document") {
        return { key: "antifile", label: "files" };
    }

    if (settings.antiphoto?.enabled && type === "image") {
        return { key: "antiphoto", label: "photos" };
    }

    if (settings.antivideo?.enabled && type === "video") {
        return { key: "antivideo", label: "videos" };
    }

    if (settings.antigif?.enabled && type === "gif") {
        return { key: "antigif", label: "GIFs" };
    }

    if (settings.antilocation?.enabled && type === "location") {
        return { key: "antilocation", label: "location sharing" };
    }

    if (
        settings.anticontact?.enabled &&
        ["contact", "contacts_array"].includes(type)
    ) {
        return { key: "anticontact", label: "contact cards" };
    }

    if (settings.antipoll?.enabled && type === "poll") {
        return { key: "antipoll", label: "polls" };
    }

    if (settings.antiforwarded?.enabled && isForwarded(msg)) {
        return { key: "antiforwarded", label: "forwarded messages" };
    }

    if (settings.antisale?.enabled && isSaleSpam(text)) {
        return { key: "antisale", label: "sale/ad spam" };
    }

    if (settings.antinum?.enabled && hasPhoneNumberSpam(text)) {
        return { key: "antinum", label: "phone number spam" };
    }

    if (settings.antibeg?.enabled && isBegging(text)) {
        return { key: "antibeg", label: "begging" };
    }

    return null;

}

/**
 * Checks an incoming group message against every enabled anti-*
 * feature for that group. Returns null if nothing was violated (or
 * moderation doesn't apply to this message at all), or a gateway
 * response object describing what to do about it.
 */
export async function checkModeration(ctx) {

    if (!ctx.isGroup || !ctx.sender) return null;

    // Never moderate admins, the bot owner, or the bot itself.
    if (ctx.isAdmin || ctx.isBotOwner) return null;

    const settings = await getGroupSettings(ctx.chat);

    const violation = await detectViolation(ctx, settings);

    if (!violation) return null;

    const featureSettings = settings[violation.key] || {};
    const action = featureSettings.action || "delete";

    const mentionTag = `@${ctx.sender.split("@")[0]}`;

    if (action === "kick") {

        return {
            success: true,
            action: "moderate",
            deleteTrigger: true,
            reply: {
                text: `🚫 ${mentionTag} was removed for ${violation.label}.`,
                mentions: [ctx.sender]
            },
            kickTarget: ctx.sender
        };

    }

    if (action === "warn") {

        const warnData = await warnService.add(
            ctx.chat,
            ctx.sender,
            `Auto: ${violation.label}`
        );

        if (warnData.count >= WARN_LIMIT) {

            await warnService.reset(ctx.chat, ctx.sender);

            return {
                success: true,
                action: "moderate",
                deleteTrigger: true,
                reply: {
                    text: `🚫 ${mentionTag} was removed after ${WARN_LIMIT} warnings for ${violation.label}.`,
                    mentions: [ctx.sender]
                },
                kickTarget: ctx.sender
            };

        }

        return {
            success: true,
            action: "moderate",
            deleteTrigger: true,
            reply: {
                text: `⚠️ ${mentionTag}, ${violation.label} isn't allowed here. Warning ${warnData.count}/${WARN_LIMIT}.`,
                mentions: [ctx.sender]
            },
            kickTarget: null
        };

    }

    // Default: plain delete, no warning escalation.
    return {
        success: true,
        action: "moderate",
        deleteTrigger: true,
        reply: {
            text: `🗑️ Removed a message from ${mentionTag} — ${violation.label} isn't allowed here.`,
            mentions: [ctx.sender]
        },
        kickTarget: null
    };

}
