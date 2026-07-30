import Reply from "../../utils/reply.js";

export default {

    name: "promoteall",

    description: "Promote all non-admin members to admin.",

    category: "Group",

    usage: ".promoteall",

    async execute(ctx) {

        if (!ctx.isGroup)
            return Reply.error("This command can only be used in groups.");

        if (!ctx.isAdmin)
            return Reply.error("Only group admins can use this command.");

        if (!ctx.isBotAdmin)
            return Reply.error("I need to be an admin to do that.");

        if (!ctx.groupMetadata)
            return Reply.error("Failed to fetch group data.");

        const targets = ctx.groupMetadata.participants
            .filter(p => !p.admin)
            .map(p => p.id);

        if (!targets.length)
            return Reply.error("Everyone is already an admin.");

        return {

            action: "promote",

            targets,

            reply: Reply.text(`👑 *Promoted ${targets.length} member(s)* to admin.`)

        };

    }

};
