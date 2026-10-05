import Reply from "../utils/reply.js";

export default {

    name: "restart",

    description: "Pull the latest version from GitHub and restart this bot. Restarts only this instance — every deployment's own owner runs it for themselves.",

    category: "Owner",

    usage: ".restart",

    async execute(ctx) {

        const { isBotOwner } = ctx;

        if (!isBotOwner)
            return Reply.error("This command is restricted to the bot owner.");

        return {

            success: true,

            action: "self_update",

            reply: Reply.info("♻️ Fetching the latest version from GitHub and restarting. This can take a minute — I'll be back shortly.")

        };

    }

};
