import Reply from "../../utils/reply.js";

export default {

    name: "setppgc",

    description: "Set the group photo from a replied image.",

    category: "Group",

    usage: "Reply to an image with .setppgc",

    async execute(ctx) {

        if (!ctx.isGroup)
            return Reply.error("This command can only be used in groups.");

        if (!ctx.isAdmin)
            return Reply.error("Only group admins can use this command.");

        if (!ctx.isBotAdmin)
            return Reply.error("I need to be an admin to do that.");

        const quoted = ctx.message?.extendedTextMessage?.contextInfo?.quotedMessage;

        if (!quoted?.imageMessage)
            return Reply.error("Reply to an image with .setppgc to use it as the group photo.");

        return { action: "set_group_photo" };

    }

};
