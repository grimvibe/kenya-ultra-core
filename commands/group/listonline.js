import Reply from "../../utils/reply.js";

export default {

    name: "listonline",

    aliases: ["online"],

    description: "Check which group members currently appear online.",

    category: "Group",

    usage: ".listonline",

    async execute(ctx) {

        if (!ctx.isGroup) {
            return Reply.error("This command only works in groups.");
        }

        const participants =
            ctx.groupMetadata?.participants?.map(p => p.id) || [];

        if (!participants.length) {
            return Reply.error("Couldn't read this group's member list.");
        }

        // Presence data only exists on the live socket, so this is
        // handed off to the gateway the same way .getpp hands off
        // profile picture fetching.
        return {
            action: "list_online",
            participants
        };

    }

};
