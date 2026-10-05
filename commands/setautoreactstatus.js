import Reply from "../utils/reply.js";
import botSettingsService from "../services/botSettingsService.js";

const EMOJI_PATTERN = /\p{Extended_Pictographic}/u;

function looksLikeEmoji(token) {
    return Boolean(token) && EMOJI_PATTERN.test(token);
}

export default {

    name: "setautoreactstatus",

    description: "Set (or change) the emoji used to auto-react to statuses, without changing on/off.",

    category: "Owner",

    usage: ".setautoreactstatus <emoji>",

    async execute(ctx) {

        if (!ctx.isBotOwner) {
            return Reply.error("Only the bot owner can use this command.");
        }

        const emoji = ctx.args[0];

        if (!looksLikeEmoji(emoji)) {

            return Reply.error(
`Provide a single emoji.

Example: .setautoreactstatus 🤧`
            );

        }

        const settings = await botSettingsService.setAutoReactStatusEmoji(
            ctx.sessionId,
            emoji
        );

        return {

            action: "update_status_settings",

            autoReactStatus: settings.autoReactStatus,

            autoReactStatusEmoji: settings.autoReactStatusEmoji,

            reply: Reply.text(
`✅ *Auto React Emoji Updated*

Emoji is now: ${settings.autoReactStatusEmoji}
Auto React Status is currently: *${settings.autoReactStatus ? "ON ✅" : "OFF ❌"}*

${settings.autoReactStatus ? "" : "Turn it on with .autoreactstatus on"}`
            )

        };

    }

};
