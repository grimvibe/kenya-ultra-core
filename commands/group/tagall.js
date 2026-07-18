export default {

    name: "tagall",

    description: "Mention all members in the group.",

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

        const mentions = [];
        let text = "📢 *Attention Everyone!*\n\n";

        for (const member of groupMetadata.participants) {

            mentions.push(member.id);

            text += `• @${member.id.split("@")[0]}\n`;

        }

        return {

            success: true,

            reply: {

                text,

                mentions

            }

        };

    }

};
