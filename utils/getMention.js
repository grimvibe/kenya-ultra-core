export default function getMention(message) {

    const mentions =
        message.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];

    if (mentions.length > 0) {
        return mentions[0];
    }

    return null;

}
