const MODES = ["all", "mention", "reply"];

export function shouldAutoReply({ settings, isGroup, message, botIds = [] }) {

    if (!settings.enabled) return false;

    if (!isGroup) return true;

    if (settings.mode === "all") return true;

    if (settings.mode === "mention") {

        const mentioned =
            message?.extendedTextMessage?.contextInfo?.mentionedJid || [];

        return mentioned.some(id => botIds.includes(id));

    }

    if (settings.mode === "reply") {

        const quotedParticipant =
            message?.extendedTextMessage?.contextInfo?.participant;

        return Boolean(
            quotedParticipant && botIds.includes(quotedParticipant)
        );

    }

    return false;

}

export { MODES };
