export default {

    name: "hidetag",

    description: "Silently mention everyone.",

    category: "Group",

    async execute(ctx) {

        const {
            isGroup,
            isAdmin,
            groupMetadata
        } = ctx;

        if (!isGroup) {

            return {
                success: false,
                reply: {
                    text: "❌ This command can only be used in groups."
                }
            };

        }

        if (!isAdmin) {

            return {
                success: false,
                reply: {
                    text: "❌ Only group admins can use this command."
                }
            };

        }

        if (!groupMetadata) {

            return {
                success: false,
                reply: {
                    text: "❌ Failed to fetch group members."
                }
            };

        }

        return {

            success: true,

            reply: {

                text: "‎",

                mentions: groupMetadata.participants.map(
                    p => p.id
                )

            }

        };

    }

};
