import Reply from "../utils/reply.js";
import botSettingsService from "../services/botSettingsService.js";

const EMOJI_PATTERN = /\p{Extended_Pictographic}/u;

function looksLikeEmoji(token) {
    return Boolean(token) && EMOJI_PATTERN.test(token);
}

export default {

    name: "autoreactstatus",

    aliases: ["autoreact"],

    description: "Automatically react to everyone's WhatsApp status updates with an emoji.",

    category: "Owner",

    usage:
".autoreactstatus on | .autoreactstatus off\n.autoreactstatus <emoji> on | .autoreactstatus <emoji> off",

    async execute(ctx) {

        if (!ctx.isBotOwner) {
            return Reply.error("Only the bot owner can use this command.");
        }

        const args = ctx.args;

        // No args — show current status.
        if (!args.length) {

            const settings = await botSettingsService.getSettings(ctx.sessionId);

            return Reply.text(
`💫 *Auto React Status*

Current: *${settings.autoReactStatus ? "ON ✅" : "OFF ❌"}*
Emoji: ${settings.autoReactStatusEmoji}

Usage:
.autoreactstatus on
.autoreactstatus off
.autoreactstatus <emoji> on
.autoreactstatus <emoji> off

To only change the emoji without touching on/off, use .setautoreactstatus <emoji>`
            );

        }

        let emoji = null;
        let toggle = null;

        if (["on", "off"].includes(args[0].toLowerCase())) {

            // .autoreactstatus on | .autoreactstatus off
            toggle = args[0].toLowerCase();

        } else {

            // .autoreactstatus <emoji> on | .autoreactstatus <emoji> off
            emoji = args[0];
            toggle = (args[1] || "").toLowerCase();

            if (!looksLikeEmoji(emoji)) {

                return Reply.error(
`That doesn't look like a single emoji.

Usage:
.autoreactstatus <emoji> on
.autoreactstatus <emoji> off

Example: .autoreactstatus 🤧 on`
                );

            }

            if (!["on", "off"].includes(toggle)) {

                return Reply.error(
`Say whether to turn it on or off too.

Example: .autoreactstatus ${emoji} on`
                );

            }

        }

        const enabled = toggle === "on";

        const settings = await botSettingsService.setAutoReactStatus(
            ctx.sessionId,
            enabled,
            emoji
        );

        return {

            action: "update_status_settings",

            autoReactStatus: settings.autoReactStatus,

            autoReactStatusEmoji: settings.autoReactStatusEmoji,

            reply: Reply.text(
`✅ *Auto React Status Updated*

Auto-reacting to statuses is now *${enabled ? "ON" : "OFF"}*.
Emoji: ${settings.autoReactStatusEmoji}`
            )

        };

    }

};
