import Reply from "../../utils/reply.js";
import { getQuotedParticipant } from "../../utils/getMention.js";

export default {

    name: "dkick",

    description: "Remove the user whose message you replied to.",

    category: "Group",

    usage: "Reply to a user's message with .dkick",

    async execute(ctx) {

        if (!ctx.isGroup)
            return Reply.error("This command can only be used in groups.");

        if (!ctx.isAdmin)
            return Reply.error("Only group admins can use this command.");

        if (!ctx.isBotAdmin)
            return Reply.error("I need to be an admin to do that.");

        const target = getQuotedParticipant(ctx.message);

        if (!target)
            return Reply.error("Reply to a message from the user you want to remove.");

        return {

            action: "kick",

            target,

            reply: Reply.text(`👢 Removed @${target.split("@")[0]} from the group.`, [target])

        };

    }

};
