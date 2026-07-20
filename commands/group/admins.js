import Reply from "../../utils/reply.js";

export default {

    name: "admins",

    description: "Show all group admins.",

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

        const owner = [];
        const admins = [];

        for (const p of groupMetadata.participants) {

            if (p.admin === "superadmin") {

                owner.push(p);

            } else if (p.admin === "admin") {

                admins.push(p);

            }

        }

        let text = `╭⊷ 👑 *GROUP ADMINS*\n`;
        text += `│\n`;
        text += `├⊷ 🏷️ *Group:* ${groupMetadata.subject}\n`;
        text += `│\n`;

        let count = 1;

        if (owner.length) {

            text += `├━━━━━━━━━━━━━━\n`;
            text += `├⊷ ⭐ *OWNER*\n`;

            for (const p of owner) {

                text += `├⊷ ${String(count).padStart(2,"0")}. ⭐ @${p.id.split("@")[0]}\n`;

                count++;

            }

        }

        if (admins.length) {

            text += `│\n`;
            text += `├━━━━━━━━━━━━━━\n`;
            text += `├⊷ 👑 *ADMINS* (${admins.length})\n`;

            for (const p of admins) {

                text += `├⊷ ${String(count).padStart(2,"0")}. 🔰 @${p.id.split("@")[0]}\n`;

                count++;

            }

        }

        text += `│\n`;
        text += `╰⊷ 🐺 *Powered by Kenya-Ultra 👑*`;

        return Reply.text(
            text,
            [...owner,...admins].map(x=>x.id)
        );

    }

};
