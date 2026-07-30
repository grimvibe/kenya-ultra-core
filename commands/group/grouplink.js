import Reply from "../../utils/reply.js";

export default {

    name: "grouplink",

    description: "Get the group's invite link.",

    category: "Group",

    usage: ".grouplink",

    async execute(ctx) {

        if (!ctx.isGroup)
            return Reply.error("This command can only be used in groups.");

        if (!ctx.isAdmin)
            return Reply.error("Only group admins can use this command.");

        if (!ctx.isBotAdmin)
            return Reply.error("I need to be an admin to do that.");

        return { action: "get_invite_link" };

    }

};
