import Reply from "../utils/reply.js";
import botSettingsService from "../services/botSettingsService.js";
import isBotOwner from "../utils/isBotOwner.js";

export default {

    name: "setprefix",

    description: "Change the bot's command prefix. Supports symbols and emojis.",

    category: "Owner",

    usage: ".setprefix <new prefix>",

    async execute(ctx) {

        if (!isBotOwner(ctx.sender, ctx.botIds)) {
            return Reply.error("Only the bot owner can use this command.");
        }

        const newPrefix = ctx.args[0];

        if (!newPrefix) {

            return Reply.error(
`Provide a new prefix.

Examples:
.setprefix !
.setprefix 🔥
.setprefix >>`
            );

        }

        if (Array.from(newPrefix).length > 10) {
            return Reply.error("Prefix is too long. Keep it short — a symbol, word, or emoji.");
        }

        if (/\s/.test(newPrefix)) {
            return Reply.error("Prefix cannot contain spaces.");
        }

        await botSettingsService.setPrefix(ctx.sessionId, newPrefix);

        return {

            action: "update_prefix",

            prefix: newPrefix,

            reply: Reply.text(
`✅ *Prefix Updated*

New prefix: ${newPrefix}

Example: ${newPrefix}menu`
            )

        };

    }

};
