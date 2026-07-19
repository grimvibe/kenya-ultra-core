import Reply from "../../utils/reply.js";
import getMention from "../../utils/getMention.js";

export default {

    name: "demote",

    description: "Remove admin rights from a member.",

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
                "I need to be a group admin first."
            );

        const target = getMention(message);

        if (!target)
            return Reply.error(
                "Mention a user.\nExample:\n.demote @user"
            );

        return {

            action: "demote",

            target,

            reply: Reply.success(
                `Demoted @${target.split("@")[0]}.`
            )

        };

    }

};
