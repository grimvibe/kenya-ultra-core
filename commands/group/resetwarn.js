import Reply from "../../utils/reply.js";
import warnService from "../../services/warnService.js";
import getMention from "../../utils/getMention.js";

export default {

    name: "resetwarn",

    description: "Reset all warnings for a user.",

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
                "Mention a user.\nExample:\n.resetwarn @user"
            );

        const data = await warnService.get(chat, target);

        if (data.count === 0)
            return Reply.error("That user has no warnings.");

        await warnService.reset(chat, target);

        return Reply.text(

`🧹 *Warnings Reset*

👤 @${target.split("@")[0]}

All warnings have been cleared.`,

            [target]

        );

    }

};
