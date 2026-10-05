import Reply from "../utils/reply.js";

export default {

    name: "getgpp",

    description: "Get this group's profile picture.",

    category: "Group",

    usage: ".getgpp",

    async execute(ctx) {

        if (!ctx.isGroup) {
            return Reply.error("This command only works in groups.");
        }

        return { action: "get_profile_picture", target: ctx.chat };

    }

};
