import Reply from "../../utils/reply.js";

export default {

    name: "open",

    description: "Open the group so everyone can send messages.",

    category: "Group",

    usage: ".open",

    async execute(ctx) {

        if (!ctx.isGroup)
            return Reply.error("This command can only be used in groups.");

        if (!ctx.isAdmin)
            return Reply.error("Only group admins can use this command.");

        if (!ctx.isBotAdmin)
            return Reply.error("I need to be an admin to do that.");

        return {

            action: "group_setting",

            setting: "not_announcement",

            reply: Reply.text(
`🔓 *Group Opened*

Everyone can send messages now.`
            )

        };

    }

};
