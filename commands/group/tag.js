import Reply from "../../utils/reply.js";

export default {

    name: "tag",

    description: "Mention everyone in the group, showing their names.",

    category: "Group",

    usage: ".tag <optional message>",

    async execute(ctx) {

        const { isGroup, isAdmin, groupMetadata, args } = ctx;

        if (!isGroup)
            return Reply.error("This command can only be used in groups.");

        if (!isAdmin)
            return Reply.error("Only group admins can use this command.");

        if (!groupMetadata)
            return Reply.error("Unable to fetch group information.");

        const message = args.length ? args.join(" ") : "📢 Attention everyone!";

        let text = `╭⊷ 📢 *TAG*\n│\n├⊷ ${message}\n│\n`;

        for (const p of groupMetadata.participants) {
            text += `├⊷ @${p.id.split("@")[0]}\n`;
        }

        text += `╰⊷ 🐺 *Powered by Kenya-Ultra 👑*`;

        return Reply.text(text, groupMetadata.participants.map(p => p.id));

    }

};
