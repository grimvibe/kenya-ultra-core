import Reply from "../utils/reply.js";
import botSettingsService from "../services/botSettingsService.js";

const SCOPE_ALIASES = {
    group: "groups",
    groups: "groups",
    dm: "dms",
    dms: "dms",
    private: "dms",
    pm: "dms",
    all: "all",
    everywhere: "all",
    both: "all"
};

const SCOPE_LABEL = {
    groups: "Groups only",
    dms: "DMs only",
    all: "Groups + DMs"
};

export default {

    name: "autorecording",

    aliases: ["autorecord"],

    description: "Automatically show a \"recording audio…\" indicator while a command is being processed.",

    category: "Owner",

    usage:
".autorecording on <groups|dms|all>\n.autorecording off",

    async execute(ctx) {

        if (!ctx.isBotOwner) {
            return Reply.error("Only the bot owner can use this command.");
        }

        const args = ctx.args;
        const choice = (args[0] || "").toLowerCase();

        if (choice === "off") {

            const settings = await botSettingsService.setAutoRecording(
                ctx.sessionId,
                "off"
            );

            return {
                action: "update_presence_settings",
                autoRecording: settings.autoRecording,
                reply: Reply.text("✅ Auto recording is now *OFF*.")
            };

        }

        if (choice === "on") {

            const rawScope = (args[1] || "all").toLowerCase();
            const scope = SCOPE_ALIASES[rawScope];

            if (!scope) {

                return Reply.error(
`Not a valid scope: "${args[1]}"

Usage:
.autorecording on groups
.autorecording on dms
.autorecording on all`
                );

            }

            const settings = await botSettingsService.setAutoRecording(
                ctx.sessionId,
                scope
            );

            return {

                action: "update_presence_settings",

                autoRecording: settings.autoRecording,

                reply: Reply.text(
`✅ *Auto Recording Updated*

Now showing "recording audio…" for: *${SCOPE_LABEL[scope]}*`
                )

            };

        }

        // No/invalid args — show current status.
        const settings = await botSettingsService.getSettings(ctx.sessionId);

        return Reply.text(
`🎙️ *Auto Recording*

Current: *${
    settings.autoRecording && settings.autoRecording !== "off"
        ? `ON — ${SCOPE_LABEL[settings.autoRecording] || settings.autoRecording}`
        : "OFF ❌"
}*

Usage:
.autorecording on groups
.autorecording on dms
.autorecording on all
.autorecording off`
        );

    }

};
