import Reply from "../../utils/reply.js";
import warnService from "../../services/warnService.js";
import getMention from "../../utils/getMention.js";

export default {

    name: "unwarn",

    description: "Remove one warning from a user.",

    category: "Group",

    async execute(ctx) {

        const {
            isGroup,
            isAdmin,
            chat,
            message
        } = ctx;

        if (!isGroup)
            return Reply.error("This command can only be used in groups.");

        if (!isAdmin)
            return Reply.error("Only group admins can use this command.");

        const target = getMention(message);

        if (!target)
            return Reply.error(
                "Mention a user.\nExample:\n.unwarn @user"
            );

        const current = await warnService.get(chat, target);

        if (current.count === 0) {
            return Reply.error("That user has no warnings.");
        }

        const data = await warnService.remove(chat, target);

        return Reply.text(

`✅ *Warning Removed*

👤 User:
@${target.split("@")[0]}

📊 Remaining Warnings:
${data.count}/3`,

            [target]

        );

    }

};
