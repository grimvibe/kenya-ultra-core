import Reply from "../../utils/reply.js";
import parseDuration from "../../utils/parseDuration.js";

export default {

    name: "demoteallTime",

    aliases: ["demoteAllTime"],

    description: "Demote all other admins for a set duration, then auto-restore.",

    category: "Group",

    usage: ".demoteallTime <10m|1h|2d>",

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
            return Reply.error("Provide a valid duration.\nExample:\n.demoteallTime 1h\n\nUnits: s, m, h, d\n\nNote: the auto-restore only fires while the bot stays running.");

        const targets = ctx.groupMetadata.participants
            .filter(p => p.admin && !(ctx.botIds || []).includes(p.id))
            .map(p => p.id);

        if (!targets.length)
            return Reply.error("There are no other admins to demote.");

        return {

            action: "demote",

            targets,

            revertAfterMs: durationMs,

            reply: Reply.text(`⬇️ *Demoted ${targets.length} admin(s)* for ${ctx.args[0]}.`)

        };

    }

};
