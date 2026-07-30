import Reply from "../../utils/reply.js";

export default {

    name: "close",

    description: "Close the group so only admins can send messages.",

    category: "Group",

    usage: ".close",

    async execute(ctx) {

        if (!ctx.isGroup)
            return Reply.error("This command can only be used in groups.");

        if (!ctx.isAdmin)
            return Reply.error("Only group admins can use this command.");

        if (!ctx.isBotAdmin)
            return Reply.error("I need to be an admin to do that.");

        return {

            action: "group_setting",

            setting: "announcement",

            reply: Reply.text(
`🔒 *Group Closed*

Only admins can send messages now.`
            )

        };

    }

};
