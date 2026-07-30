import Reply from "../../utils/reply.js";

export default {

    name: "left",

    aliases: ["leave"],

    description: "Make the bot leave the group.",

    category: "Group",

    usage: ".left",

    async execute(ctx) {

        if (!ctx.isGroup)
            return Reply.error("This command can only be used in groups.");

        if (!ctx.isAdmin)
            return Reply.error("Only group admins can use this command.");

        return { action: "leave_group" };

    }

};
