import Reply from "../../utils/reply.js";

export default {

    name: "tagadmin",

    description: "Mention only the group's admins.",

    category: "Group",

    usage: ".tagadmin <optional message>",

    async execute(ctx) {

        const { isGroup, isAdmin, groupMetadata, args } = ctx;

        if (!isGroup)
            return Reply.error("This command can only be used in groups.");

        if (!isAdmin)
            return Reply.error("Only group admins can use this command.");

        if (!groupMetadata)
            return Reply.error("Unable to fetch group information.");

        const admins = groupMetadata.participants.filter(p => p.admin);

        if (!admins.length)
            return Reply.error("No admins found in this group.");

        const message = args.length ? args.join(" ") : "📢 Attention admins!";

        let text = `╭⊷ 👑 *TAG ADMINS*\n│\n├⊷ ${message}\n│\n`;

        for (const p of admins) {
            text += `├⊷ @${p.id.split("@")[0]}\n`;
        }

        text += `╰⊷ 🐺 *Powered by Kenya-Ultra 👑*`;

        return Reply.text(text, admins.map(p => p.id));

    }

};
