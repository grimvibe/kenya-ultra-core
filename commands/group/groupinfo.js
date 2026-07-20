import Reply from "../../utils/reply.js";

export default {

    name: "groupinfo",

    description: "Display group information.",

    category: "Group",

    async execute(ctx) {

        const {

            isGroup,

            groupMetadata

        } = ctx;

        if (!isGroup)
            return Reply.error(
                "This command can only be used in groups."
            );

        const admins =
            groupMetadata.participants.filter(
                p=>p.admin
            ).length;

        let text = `╭⊷ 👥 *GROUP INFO*\n`;
        text += `│\n`;
        text += `├⊷ 🏷️ *Name:* ${groupMetadata.subject}\n`;
        text += `├⊷ 👥 *Members:* ${groupMetadata.participants.length}\n`;
        text += `├⊷ 👑 *Admins:* ${admins}\n`;

        if (groupMetadata.desc) {

            text += `├⊷ 📝 *Description:*\n`;
            text += `├⊷ ${groupMetadata.desc}\n`;

        }

        text += `│\n`;
        text += `╰⊷ 🐺 *Powered by Kenya-Ultra 👑*`;

        return Reply.text(text);

    }

};
