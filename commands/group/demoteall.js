import Reply from "../../utils/reply.js";

export default {

    name: "demoteall",

    description: "Demote all other admins to regular members.",

    category: "Group",

    usage: ".demoteall",

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
            .filter(p => p.admin && !(ctx.botIds || []).includes(p.id))
            .map(p => p.id);

        if (!targets.length)
            return Reply.error("There are no other admins to demote.");

        return {

            action: "demote",

            targets,

            reply: Reply.text(`⬇️ *Demoted ${targets.length} admin(s)* to regular members.`)

        };

    }

};
