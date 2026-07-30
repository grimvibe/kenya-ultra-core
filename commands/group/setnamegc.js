import Reply from "../../utils/reply.js";

export default {

    name: "setnamegc",

    description: "Change the group's name.",

    category: "Group",

    usage: ".setnamegc <new name>",

    async execute(ctx) {

        if (!ctx.isGroup)
            return Reply.error("This command can only be used in groups.");

        if (!ctx.isAdmin)
            return Reply.error("Only group admins can use this command.");

        if (!ctx.isBotAdmin)
            return Reply.error("I need to be an admin to do that.");

        const subject = (ctx.args || []).join(" ").trim();

        if (!subject)
            return Reply.error("Provide a new group name.\nExample:\n.setnamegc My Cool Group");

        if (subject.length > 100)
            return Reply.error("Group name must be 100 characters or fewer.");

        return {

            action: "update_subject",

            subject,

            reply: Reply.text(`✏️ *Group Name Updated*\n\nNew name: ${subject}`)

        };

    }

};
