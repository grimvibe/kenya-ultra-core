import Reply from "../../utils/reply.js";
import getMention from "../../utils/getMention.js";

export default {

    name: "kick",

    description: "Remove a member from the group.",

    category: "Group",

    async execute(ctx) {

        const {
            isGroup,
            isAdmin,
            isBotAdmin,
            message
        } = ctx;

        if (!isGroup)
            return Reply.error("This command can only be used in groups.");

        if (!isAdmin)
            return Reply.error("Only group admins can use this command.");

        if (!isBotAdmin)
            return Reply.error("I need to be an admin first.");

        const target = getMention(message);

        if (!target)
            return Reply.error(
                "Mention a user.\nExample:\n.kick @user"
            );

        return {
            action: "kick",
            target,
            reply: Reply.text(
                `👢 Successfully removed @${target.split("@")[0]}`,
                [target]
            )
        };

    }

};
