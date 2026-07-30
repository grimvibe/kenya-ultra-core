import Reply from "../../utils/reply.js";

export default {

    name: "kickall",

    description: "Remove all non-admin members from the group.",

    category: "Group",

    usage: ".kickall",

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
            return Reply.error("There are no non-admin members to remove.");

        return {

            action: "kick",

            targets,

            reply: Reply.text(`👢 *Removed ${targets.length} member(s)* from the group.`)

        };

    }

};
