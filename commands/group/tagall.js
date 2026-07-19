import Reply from "../../utils/reply.js";

export default {

    name: "tagall",

    description: "Mention every member in the group.",

    category: "Group",

    async execute(ctx) {

        const {
            isGroup,
            isAdmin,
            groupMetadata
        } = ctx;

        if (!isGroup)
            return Reply.error(
                "This command can only be used in groups."
            );

        if (!isAdmin)
            return Reply.error(
                "Only group admins can use this command."
            );

        if (!groupMetadata)
            return Reply.error(
                "Unable to fetch group information."
            );

        const participants = groupMetadata.participants;

        const admins = [];
        const members = [];

        for (const participant of participants) {

            if (participant.admin) {

                admins.push(participant);

            } else {

                members.push(participant);

            }

        }

        let text = `╭⊷ 📢 *TAG ALL*\n`;
        text += `│\n`;
        text += `├⊷ 🏷️ *Group:* ${groupMetadata.subject}\n`;
        text += `├⊷ 👥 *Members:* ${participants.length}\n`;
        text += `│\n`;

        text += `├⊷ 👑 *ADMINS* (${admins.length})\n`;

        let count = 1;

        for (const admin of admins) {

            const icon =
                admin.admin === "superadmin"
                    ? "⭐"
                    : "🔰";

            text += `├⊷ ${String(count).padStart(2, "0")}. ${icon} @${admin.id.split("@")[0]}\n`;

            count++;

        }

        text += `│\n`;
        text += `├⊷ 👤 *MEMBERS* (${members.length})\n`;

        for (const member of members) {

            text += `├⊷ ${String(count).padStart(2, "0")}. @${member.id.split("@")[0]}\n`;

            count++;

        }

        text += `│\n`;
        text += `╰⊷ 🐺 *Powered by Kenya-Ultra 👑*`;

        return Reply.text(
            text,
            participants.map(p => p.id)
        );

    }

};
