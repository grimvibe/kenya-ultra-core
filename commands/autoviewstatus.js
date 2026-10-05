import Reply from "../utils/reply.js";
import botSettingsService from "../services/botSettingsService.js";

export default {

    name: "autoviewstatus",

    aliases: ["autoview"],

    description: "Automatically view (mark as seen) everyone's WhatsApp status updates.",

    category: "Owner",

    usage: ".autoviewstatus on | .autoviewstatus off",

    async execute(ctx) {

        if (!ctx.isBotOwner) {
            return Reply.error("Only the bot owner can use this command.");
        }

        const choice = (ctx.args[0] || "").toLowerCase();

        if (!["on", "off"].includes(choice)) {

            const settings = await botSettingsService.getSettings(ctx.sessionId);

            return Reply.text(
`👁️ *Auto View Status*

Current: *${settings.autoViewStatus ? "ON ✅" : "OFF ❌"}*

Usage:
.autoviewstatus on
.autoviewstatus off`
            );

        }

        const enabled = choice === "on";

        await botSettingsService.setAutoViewStatus(ctx.sessionId, enabled);

        return {

            action: "update_status_settings",

            autoViewStatus: enabled,

            reply: Reply.text(
`✅ *Auto View Status Updated*

Auto-viewing statuses is now *${enabled ? "ON" : "OFF"}*.`
            )

        };

    }

};
