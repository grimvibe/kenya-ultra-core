// Checks whether a message was sent by the bot's own linked number —
// i.e. the actual owner of THIS bot instance/session. This is distinct
// from utils/isOwner.js, which checks against the platform-wide
// OWNER_NUMBER (the bot developer) for platform admin commands.

export default function isBotOwner(sender, botIds = []) {

    if (!sender || !botIds?.length) {
        return false;
    }

    return botIds.includes(sender);

}
