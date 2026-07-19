import Reply from "../../utils/reply.js";

export default {

    name: "tagall",

    description: "Mention everyone in the group.",

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

        const owner = [];
        const admins = [];
        const members = [];

        for (const participant of groupMetadata.participants) {

            if (participant.admin === "superadmin") {

                owner.push(participant);

            } else if (participant.admin === "admin") {

                admins.push(participant);

            } else {

                members.push(participant);

            }

        }

        let text = `╭⊷ 📢 *TAG ALL*\n`;
        text += `│\n`;
        text += `├⊷ 🏷️ *Group:* ${groupMetadata.subject}\n`;
        text += `├⊷ 👥 *Members:* ${groupMetadata.participants.length}\n`;
        text += `│\n`;

        let count = 1;

        // OWNER
        if (owner.length) {

            text += `├━━━━━━━━━━━━━━\n`;
            text += `├⊷ ⭐ *OWNER*\n`;

            for (const user of owner) {

                text += `├⊷ ${String(count).padStart(2, "0")}. ⭐ @${user.id.split("@")[0]}\n`;

                count++;

            }

            text += `│\n`;

        }

        // ADMINS
        if (admins.length) {

            text += `├━━━━━━━━━━━━━━\n`;
            text += `├⊷ 👑 *ADMINS* (${admins.length})\n`;

            for (const user of admins) {

                text += `├⊷ ${String(count).padStart(2, "0")}. 🔰 @${user.id.split("@")[0]}\n`;

                count++;

            }

            text += `│\n`;

        }

        // MEMBERS
        if (members.length) {

            text += `├━━━━━━━━━━━━━━\n`;
            text += `├⊷ 👤 *MEMBERS* (${members.length})\n`;

            for (const user of members) {

                text += `├⊷ ${String(count).padStart(2, "0")}. @${user.id.split("@")[0]}\n`;

                count++;

            }

            text += `│\n`;

        }

        text += `╰⊷ 🐺 *Powered by Kenya-Ultra 👑*`;

        return Reply.text(

            text,

            groupMetadata.participants.map(p => p.id)

        );

    }

};
