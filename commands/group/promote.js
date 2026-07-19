import Reply from "../../utils/reply.js";
import getMention from "../../utils/getMention.js";

export default {

    name: "promote",

    description: "Promote a group member to admin.",

    category: "Group",

    async execute(ctx) {

        const {
            isGroup,
            isAdmin,
            isBotAdmin,
            message
        } = ctx;

        if (!isGroup)
            return Reply.error(
                "This command can only be used in groups."
            );

        if (!isAdmin)
            return Reply.error(
                "Only group admins can use this command."
            );

        if (!isBotAdmin)
            return Reply.error(
                "I need to be an admin first."
            );

        const target = getMention(message);

        if (!target)
            return Reply.error(
                "Mention a user.\nExample:\n.promote @user"
            );

        return {

            action: "promote",

            target,

            reply: Reply.success(
                `Promoted @${target.split("@")[0]} to admin.`
            )

        };

    }

};
