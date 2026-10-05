// Pure, stateless detection helpers. Each one takes the raw Baileys
// message content object (ctx.message) and/or the plain text, and
// returns true/false. No I/O here — Redis-backed checks (like spam
// bursts) live in moderationService.js instead.

const LINK_REGEX = /https?:\/\/\S+|www\.\S+|chat\.whatsapp\.com\/\S+/i;

// Small built-in default lists. Not admin-configurable yet — that
// would need its own command + storage, out of scope for this pass.
const DEFAULT_BADWORDS = [
    "nigger", "nigga", "fuck you", "fuck u", "bitch", "asshole",
    "cunt", "whore", "slut", "bastard"
];

const SALE_KEYWORDS = [
    "for sale", "dm to buy", "dm to order", "selling fast",
    "price:", "order now", "wholesale price", "buy now"
];

const BEG_KEYWORDS = [
    "send money", "send me money", "donate to", "i need money urgently",
    "gift me", "please help me financially", "loan me", "cashapp me"
];

export function hasLink(text = "") {
    return LINK_REGEX.test(text);
}

export function containsBadWord(text = "", extraList = []) {

    const lower = text.toLowerCase();

    return [...DEFAULT_BADWORDS, ...extraList].some(word =>
        lower.includes(word)
    );

}

// Matches variation selectors and the zero-width joiner too, so
// compound emoji (👨‍👩‍👧, skin-tone modifiers, etc.) get fully
// stripped rather than leaving stray invisible characters behind.
const EMOJI_STRIP_REGEX =
    /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{1F1E6}-\u{1F1FF}\u{FE0F}\u{200D}]/gu;

export function isEmojiHeavy(text = "") {

    const trimmed = text.trim();

    if (!trimmed) return false;

    const emojiCount = (trimmed.match(EMOJI_STRIP_REGEX) || []).length;

    if (emojiCount === 0) return false;

    // Strip every emoji out — if nothing but whitespace is left, the
    // message was purely emoji (this is the common case: "😂",
    // "💗💓", etc.) and should be flagged regardless of count.
    const withoutEmoji = trimmed
        .replace(EMOJI_STRIP_REGEX, "")
        .trim();

    if (withoutEmoji.length === 0) return true;

    // Otherwise, only flag genuinely emoji-dominated mixed text.
    return emojiCount >= 6;

}

export function isSaleSpam(text = "") {

    const lower = text.toLowerCase();

    return SALE_KEYWORDS.some(k => lower.includes(k));

}

export function isBegging(text = "") {

    const lower = text.toLowerCase();

    return BEG_KEYWORDS.some(k => lower.includes(k));

}

export function hasPhoneNumberSpam(text = "") {

    // Flags an 8+ digit run (with optional +, spaces, or dashes),
    // the shape of a phone number being dropped as spam.
    return /(\+?\d[\d\-\s]{7,}\d)/.test(text);

}

// contextInfo can live under any of these message-type containers
// depending on what was actually sent, so check them all.
function getContextInfo(msg) {

    if (!msg) return null;

    return (
        msg.extendedTextMessage?.contextInfo ||
        msg.imageMessage?.contextInfo ||
        msg.videoMessage?.contextInfo ||
        msg.stickerMessage?.contextInfo ||
        msg.documentMessage?.contextInfo ||
        msg.audioMessage?.contextInfo ||
        null
    );

}

export function getMentionedJids(msg) {

    return getContextInfo(msg)?.mentionedJid || [];

}

export function isForwarded(msg) {

    const ctx = getContextInfo(msg);

    return Boolean(
        ctx?.isForwarded || (ctx?.forwardingScore || 0) > 0
    );

}

// One-word classification of what kind of media/message this is,
// or null for plain text.
export function getMessageType(msg) {

    if (!msg) return null;

    if (msg.stickerMessage) return "sticker";
    if (msg.audioMessage) return msg.audioMessage.ptt ? "ptt" : "audio";
    if (msg.documentMessage) return "document";
    if (msg.imageMessage) return "image";

    if (msg.videoMessage) {
        return msg.videoMessage.gifPlayback ? "gif" : "video";
    }

    if (msg.locationMessage || msg.liveLocationMessage) return "location";
    if (msg.contactMessage) return "contact";
    if (msg.contactsArrayMessage) return "contacts_array";

    if (
        msg.pollCreationMessage ||
        msg.pollCreationMessageV2 ||
        msg.pollCreationMessageV3
    ) {
        return "poll";
    }

    return null;

}
