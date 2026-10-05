import Reply from "../utils/reply.js";
import { getQuotedParticipant } from "../utils/getMention.js";
import getMention from "../utils/getMention.js";

export default {

    name: "getpp",

    description: "Get someone's profile picture. Reply to their message, or mention them.",

    category: "General",

    usage: "Reply to a user's message with .getpp (or .getpp @user)",

    async execute(ctx) {

        const target =
            getQuotedParticipant(ctx.message) ||
            getMention(ctx.message);

        if (!target)
            return Reply.error(
"Reply to a user's message with .getpp, or mention them.\n\nExample:\n.getpp @user"
            );

        return { action: "get_profile_picture", target };

    }

};
