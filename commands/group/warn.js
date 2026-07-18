import Reply from "../../utils/reply.js";
import warnService from "../../services/warnService.js";
import getMention from "../../utils/getMention.js";

export default {

    name: "warn",

    description: "Warn a group member.",

    category: "Group",

    async execute(ctx) {

        const {
            isGroup,
            isAdmin,
            chat,
            args,
            message
        } = ctx;

        if (!isGroup)
            return Reply.error("This command can only be used in groups.");

        if (!isAdmin)
            return Reply.error("Only group admins can use this command.");

        const target = getMention(message);

        if (!target)
            return Reply.error(
                "Mention a user.\nExample:\n.warn @user Spamming"
            );

        const reason =
            args.slice(1).join(" ") || "No reason provided.";

        const data = await warnService.add(
            chat,
            target,
            reason
        );

        return Reply.text(

`⚠️ *Warning Issued*

👤 User:
@${target.split("@")[0]}

📝 Reason:
${reason}

📊 Warnings:
${data.count}/3`,

            [target]

        );

    }

};
