import Reply from "../../utils/reply.js";

export default {

    name: "delall",

    description: "Delete the bot's own recent messages in this chat.",

    category: "Group",

    usage: ".delall",

    async execute(ctx) {

        if (!ctx.isAdmin && ctx.isGroup)
            return Reply.error("Only group admins can use this command.");

        return { action: "delete_own_messages" };

    }

};
