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
