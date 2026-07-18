import Reply from "../../utils/reply.js";
import warnService from "../../services/warnService.js";
import getMention from "../../utils/getMention.js";

export default {

    name: "warnings",

    description: "View a user's warnings.",

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
                "Mention a user.\nExample:\n.warnings @user"
            );

        const data = await warnService.get(chat, target);

        if (data.count === 0) {

            return Reply.text(

`✅ *User Warning Record*

👤 @${target.split("@")[0]}

Warnings: 0/3

This user has a clean record.`,

                [target]

            );

        }

        const history = data.reasons
            .map((item, index) =>
                `${index + 1}. ${item.reason}`
            )
            .join("\n");

        return Reply.text(

`⚠️ *User Warning Record*

👤 @${target.split("@")[0]}

Warnings: ${data.count}/3

📝 Reasons:
${history}`,

            [target]

        );

    }

};
