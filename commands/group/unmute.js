import Reply from "../../utils/reply.js";
import muteService from "../../services/muteService.js";
import getMention from "../../utils/getMention.js";

export default {

    name: "unmute",

    description: "Remove a mute from a group member.",

    category: "Group",

    usage: ".unmute @user",

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
                "Mention a user.\nExample:\n.unmute @user"
            );

        const existed = await muteService.unmute(chat, target);

        if (!existed)
            return Reply.error("That user isn't muted.");

        return Reply.text(
            `🔊 *Unmuted*\n\n@${target.split("@")[0]} can now send messages again.`,
            [target]
        );

    }

};
