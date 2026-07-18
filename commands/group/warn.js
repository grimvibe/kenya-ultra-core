import Reply from "../../utils/reply.js";
import getMention from "../../utils/getMention.js";
import warnService from "../../services/warnService.js";

export default {

    name: "warn",

    description: "Warn a group member.",

    category: "Group",

    async execute(message) {

        if (!message.isGroup)
            return Reply.error("This command only works in groups.");

        if (!message.isAdmin)
            return Reply.error("Only group admins can use this command.");

        const user = getMention(message);

        if (!user)
            return Reply.error("Mention a user.\nExample:\n.warn @user Spamming");

        const reason =
            message.args.slice(1).join(" ") || "No reason";

        const data = await warnService.add(
            message.chat,
            user,
            reason
        );

        return Reply.text(
`⚠️ *Warning Issued*

👤 @${user.split("@")[0]}

📝 Reason:
${reason}

📊 Warnings:
${data.count}/3`
        );

    }

};
