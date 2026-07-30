import Reply from "../../utils/reply.js";
import muteService from "../../services/muteService.js";
import { getQuotedParticipant } from "../../utils/getMention.js";

export default {

    name: "dmute",

    description: "Mute the user whose message you replied to.",

    category: "Group",

    usage: "Reply to a user's message with .dmute",

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

        const target = getQuotedParticipant(message);

        if (!target)
            return Reply.error(
                "Reply to a message from the user you want to mute."
            );

        await muteService.mute(chat, target);

        return Reply.text(
            `🔇 *Muted*\n\n@${target.split("@")[0]} has been muted.`,
            [target]
        );

    }

};
