import Reply from "../utils/reply.js";
import botSettingsService from "../services/botSettingsService.js";
import isBotOwner from "../utils/isBotOwner.js";

export default {

    name: "mode",

    description: "Switch the bot between public and private mode.",

    category: "Owner",

    usage: ".mode public | .mode private",

    async execute(ctx) {

        if (!isBotOwner(ctx.sender, ctx.botIds)) {
            return Reply.error("Only the bot owner can use this command.");
        }

        const choice = (ctx.args[0] || "").toLowerCase();

        if (!["public", "private"].includes(choice)) {

            const settings = await botSettingsService.getSettings(ctx.sessionId);

            return Reply.text(
`⚙️ *Bot Mode*

Current: *${settings.mode.toUpperCase()}*

Usage:
.mode public
.mode private`
            );

        }

        await botSettingsService.setMode(ctx.sessionId, choice);

        return Reply.text(
`✅ *Mode Updated*

Bot is now in *${choice.toUpperCase()}* mode.

${choice === "private"
    ? "Only you (the owner) can use commands now."
    : "Everyone can use commands now."}`
        );

    }

};
