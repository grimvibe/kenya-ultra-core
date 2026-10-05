import Reply from "../../utils/reply.js";
import parseDuration from "../../utils/parseDuration.js";

export default {

    name: "promoteallTime",

    aliases: ["promoteAllTime"],

    description: "Promote all non-admin members for a set duration, then auto-demote.",

    category: "Group",

    usage: ".promoteallTime <10m|1h|2d>",

    async execute(ctx) {

        if (!ctx.isGroup)
            return Reply.error("This command can only be used in groups.");

        if (!ctx.isAdmin)
            return Reply.error("Only group admins can use this command.");

        if (!ctx.isBotAdmin)
            return Reply.error("I need to be an admin to do that.");

        if (!ctx.groupMetadata)
            return Reply.error("Failed to fetch group data.");

        const durationMs = parseDuration(ctx.args[0]);

        if (!durationMs)
            return Reply.error("Provide a valid duration.\nExample:\n.promoteallTime 1h\n\nUnits: s, m, h, d\n\nNote: the auto-revert only fires while the bot stays running.");

        const targets = ctx.groupMetadata.participants
            .filter(p => !p.admin)
            .map(p => p.id);

        if (!targets.length)
            return Reply.error("Everyone is already an admin.");

        return {

            action: "promote",

            targets,

            revertAfterMs: durationMs,

            reply: Reply.text(`👑 *Promoted ${targets.length} member(s)* for ${ctx.args[0]}.`)

        };

    }

};
