export default function getMention(message) {

    if (!message) return null;

    // Normal text message with mentions
    if (
        message.extendedTextMessage?.contextInfo?.mentionedJid?.length
    ) {
        return message.extendedTextMessage.contextInfo.mentionedJid[0];
    }

    // Image caption with mentions
    if (
        message.imageMessage?.contextInfo?.mentionedJid?.length
    ) {
        return message.imageMessage.contextInfo.mentionedJid[0];
    }

    // Video caption with mentions
    if (
        message.videoMessage?.contextInfo?.mentionedJid?.length
    ) {
        return message.videoMessage.contextInfo.mentionedJid[0];
    }

    return null;

}

// Returns the sender of the message being replied to (quoted), if any.
export function getQuotedParticipant(message) {

    if (!message) return null;

    return (
        message.extendedTextMessage?.contextInfo?.participant ||
        message.imageMessage?.contextInfo?.participant ||
        message.videoMessage?.contextInfo?.participant ||
        null
    );

}

// Returns the actual content object of the message being replied to
// (quoted), if any — e.g. { imageMessage: {...} } or
// { stickerMessage: {...} }. Used by commands that need to inspect
// or act on quoted media, like .sticker and .take.
export function getQuotedMessage(message) {

    if (!message) return null;

    return (
        message.extendedTextMessage?.contextInfo?.quotedMessage ||
        message.imageMessage?.contextInfo?.quotedMessage ||
        message.videoMessage?.contextInfo?.quotedMessage ||
        null
    );

}
