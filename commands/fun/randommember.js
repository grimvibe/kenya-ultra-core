import Reply from "../../utils/reply.js";

export default {

    name: "randommember",

    description: "Pick a random member from the group.",

    category: "Group",

    async execute(ctx) {

        const {
            isGroup,
            groupMetadata
        } = ctx;

        if (!isGroup)
            return Reply.error("This command can only be used in groups.");

        if (!groupMetadata)
            return Reply.error("Failed to fetch group data.");

        const participants = groupMetadata.participants;

        const chosen = participants[Math.floor(Math.random() * participants.length)];

        return Reply.text(
            `🎯 *Random Member*\n\n@${chosen.id.split("@")[0]}`,
            [chosen.id]
        );

    }

};
