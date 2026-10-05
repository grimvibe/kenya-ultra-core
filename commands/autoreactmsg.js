import Reply from "../utils/reply.js";
import botSettingsService from "../services/botSettingsService.js";

const EMOJI_PATTERN = /\p{Extended_Pictographic}/u;

function looksLikeEmoji(token) {
    return Boolean(token) && EMOJI_PATTERN.test(token);
}

export default {

    name: "autoreactmsg",

    aliases: ["arm"],

    description: "Automatically react to incoming chat messages (DMs/groups) with an emoji. Not to be confused with .autoreactstatus, which reacts to WhatsApp Status updates instead.",

    category: "Owner",

    usage:
".autoreactmsg on | .autoreactmsg off\n.autoreactmsg <emoji> on | .autoreactmsg <emoji> off",

    async execute(ctx) {

        if (!ctx.isBotOwner) {
            return Reply.error("Only the bot owner can use this command.");
        }

        const args = ctx.args;

        // No args — show current status.
        if (!args.length) {

            const settings = await botSettingsService.getSettings(ctx.sessionId);

            return Reply.text(
`💬 *Auto React (Messages)*

Current: *${settings.autoReactMessages ? "ON ✅" : "OFF ❌"}*
Emoji: ${settings.autoReactMessagesEmoji || "👍"}

Usage:
.autoreactmsg on
.autoreactmsg off
.autoreactmsg <emoji> on
.autoreactmsg <emoji> off`
            );

        }

        let emoji = null;
        let toggle = null;

        if (["on", "off"].includes(args[0].toLowerCase())) {

            toggle = args[0].toLowerCase();

        } else {

            emoji = args[0];
            toggle = (args[1] || "").toLowerCase();

            if (!looksLikeEmoji(emoji)) {

                return Reply.error(
`That doesn't look like a single emoji.

Usage:
.autoreactmsg <emoji> on
.autoreactmsg <emoji> off

Example: .autoreactmsg 👍 on`
                );

            }

            if (!["on", "off"].includes(toggle)) {

                return Reply.error(
`Say whether to turn it on or off too.

Example: .autoreactmsg ${emoji} on`
                );

            }

        }

        const enabled = toggle === "on";

        const settings = await botSettingsService.setAutoReactMessages(
            ctx.sessionId,
            enabled,
            emoji
        );

        return {

            action: "update_message_react_settings",

            autoReactMessages: settings.autoReactMessages,

            autoReactMessagesEmoji: settings.autoReactMessagesEmoji,

            reply: Reply.text(
`✅ *Auto React (Messages) Updated*

Auto-reacting to chat messages is now *${enabled ? "ON" : "OFF"}*.
Emoji: ${settings.autoReactMessagesEmoji || "👍"}`
            )

        };

    }

};
