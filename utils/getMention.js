export default function getMention(message) {

    const mentions =
        message.message?.extendedTextMessage
            ?.contextInfo?.mentionedJid || [];

    return mentions.length
        ? mentions[0]
        : null;

}
