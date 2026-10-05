import Reply from "../../utils/reply.js";
import parseDuration from "../../utils/parseDuration.js";

export default {

    name: "opentime",

    description: "Open the group for a set duration, then auto-reclose.",

    category: "Group",

    usage: ".opentime <10m|1h|2d>",

    async execute(ctx) {

        if (!ctx.isGroup)
            return Reply.error("This command can only be used in groups.");

        if (!ctx.isAdmin)
            return Reply.error("Only group admins can use this command.");

        if (!ctx.isBotAdmin)
            return Reply.error("I need to be an admin to do that.");

        const durationMs = parseDuration(ctx.args[0]);

        if (!durationMs)
            return Reply.error("Provide a valid duration.\nExample:\n.opentime 1h\n\nUnits: s, m, h, d\n\nNote: the auto-reclose only fires while the bot stays running.");

        return {

            action: "group_setting",

            setting: "not_announcement",

            revertAfterMs: durationMs,

            reply: Reply.text(`🔓 *Group Opened*\n\nWill auto-close in ${ctx.args[0]}.`)

        };

    }

};
