import Reply from "../../utils/reply.js";
import muteService from "../../services/muteService.js";
import getMention from "../../utils/getMention.js";

export default {

    name: "mute",

    description: "Mute a group member (their messages should be removed by the bot).",

    category: "Group",

    usage: ".mute @user",

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
                "Mention a user.\nExample:\n.mute @user"
            );

        await muteService.mute(chat, target);

        return Reply.text(
            `🔇 *Muted*\n\n@${target.split("@")[0]} has been muted.`,
            [target]
        );

    }

};
