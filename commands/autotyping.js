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

    name: "autotyping",

    aliases: ["autotype"],

    description: "Automatically show a \"typing…\" indicator while a command is being processed.",

    category: "Owner",

    usage:
".autotyping on <groups|dms|all>\n.autotyping off",

    async execute(ctx) {

        if (!ctx.isBotOwner) {
            return Reply.error("Only the bot owner can use this command.");
        }

        const args = ctx.args;
        const choice = (args[0] || "").toLowerCase();

        if (choice === "off") {

            const settings = await botSettingsService.setAutoTyping(
                ctx.sessionId,
                "off"
            );

            return {
                action: "update_presence_settings",
                autoTyping: settings.autoTyping,
                reply: Reply.text("✅ Auto typing is now *OFF*.")
            };

        }

        if (choice === "on") {

            const rawScope = (args[1] || "all").toLowerCase();
            const scope = SCOPE_ALIASES[rawScope];

            if (!scope) {

                return Reply.error(
`Not a valid scope: "${args[1]}"

Usage:
.autotyping on groups
.autotyping on dms
.autotyping on all`
                );

            }

            const settings = await botSettingsService.setAutoTyping(
                ctx.sessionId,
                scope
            );

            return {

                action: "update_presence_settings",

                autoTyping: settings.autoTyping,

                reply: Reply.text(
`✅ *Auto Typing Updated*

Now showing "typing…" for: *${SCOPE_LABEL[scope]}*`
                )

            };

        }

        // No/invalid args — show current status.
        const settings = await botSettingsService.getSettings(ctx.sessionId);

        return Reply.text(
`⌨️ *Auto Typing*

Current: *${
    settings.autoTyping && settings.autoTyping !== "off"
        ? `ON — ${SCOPE_LABEL[settings.autoTyping] || settings.autoTyping}`
        : "OFF ❌"
}*

Usage:
.autotyping on groups
.autotyping on dms
.autotyping on all
.autotyping off`
        );

    }

};
