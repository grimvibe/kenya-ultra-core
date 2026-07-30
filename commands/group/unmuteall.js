import Reply from "../../utils/reply.js";
import muteService from "../../services/muteService.js";

export default {

    name: "unmuteall",

    description: "Remove all mutes in the group.",

    category: "Group",

    usage: ".unmuteall",

    async execute(ctx) {

        const {
            isGroup,
            isAdmin,
            chat
        } = ctx;

        if (!isGroup)
            return Reply.error("This command can only be used in groups.");

        if (!isAdmin)
            return Reply.error("Only group admins can use this command.");

        await muteService.unmuteAll(chat);

        return Reply.text(
            `🔊 *Group Unmuted*\n\nAll mutes have been cleared. Everyone can send messages again.`
        );

    }

};
