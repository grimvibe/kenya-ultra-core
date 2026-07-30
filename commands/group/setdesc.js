import Reply from "../../utils/reply.js";

export default {

    name: "setdesc",

    description: "Change the group's description.",

    category: "Group",

    usage: ".setdesc <new description>",

    async execute(ctx) {

        if (!ctx.isGroup)
            return Reply.error("This command can only be used in groups.");

        if (!ctx.isAdmin)
            return Reply.error("Only group admins can use this command.");

        if (!ctx.isBotAdmin)
            return Reply.error("I need to be an admin to do that.");

        const description = (ctx.args || []).join(" ").trim();

        if (!description)
            return Reply.error("Provide a new description.\nExample:\n.setdesc Welcome to our group!");

        return {

            action: "update_description",

            description,

            reply: Reply.text(`📝 *Group Description Updated*`)

        };

    }

};
