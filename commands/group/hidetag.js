import Reply from "../../utils/reply.js";

export default {

    name: "hidetag",

    description: "Mention everyone silently.",

    category: "Group",

    async execute(ctx) {

        const {

            isGroup,

            isAdmin,

            isBotAdmin,

            groupMetadata,

            args

        } = ctx;

        if (!isGroup)
            return Reply.error(
                "This command can only be used in groups."
            );

        if (!isAdmin)
            return Reply.error(
                "Only admins can use this command."
            );

        if (!isBotAdmin)
            return Reply.error(
                "I need admin rights first."
            );

        const message =
            args.length
                ? args.join(" ")
                : "📢 Attention everyone!";

        return Reply.groupIcon({

            caption:
`╭⊷ 📢 *HIDETAG*

│

├⊷ ${message}

│

╰⊷ 🐺 *Powered by Kenya-Ultra 👑*`,

            mentions: groupMetadata.participants.map(p => p.id)

        });

    }

};
