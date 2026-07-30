import Reply from "../../utils/reply.js";

export default {

    name: "kickadmins",

    description: "Remove all other admins from the group.",

    category: "Group",

    usage: ".kickadmins",

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
            .filter(p => p.admin && p.id !== ctx.sender && !(ctx.botIds || []).includes(p.id))
            .map(p => p.id);

        if (!targets.length)
            return Reply.error("There are no other admins to remove.");

        return {

            action: "kick",

            targets,

            reply: Reply.text(`👢 *Removed ${targets.length} admin(s)* from the group.`)

        };

    }

};
