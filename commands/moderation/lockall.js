import { getGroupSettings, setGroupSetting } from "../../settings/settingsStore.js";
import Reply from "../../utils/reply.js";

const ANTI_KEYS = [
    "antilink", "antibot", "antispam", "antibadword", "antidelete",
    "antiedit", "antibeg", "antisticker", "antivoice", "antifile",
    "antiphoto", "antivideo", "antiemoji", "antitag", "antimention",
    "antipoll", "antigif", "antiforwarded", "antilocation",
    "anticontact", "antisale", "antinum"
];

export default {

    name: "lockall",

    description: "Turn on every anti-filter at once.",

    category: "Moderation",

    usage: ".lockall",

    async execute(ctx) {

        if (!ctx.isGroup)
            return Reply.error("This command can only be used in groups.");

        if (!ctx.isAdmin)
            return Reply.error("Only group admins can use this command.");

        const settings = await getGroupSettings(ctx.chat);

        for (const key of ANTI_KEYS) {

            const current = settings[key] || { enabled: false };
            current.enabled = true;

            await setGroupSetting(ctx.chat, key, current);

        }

        return Reply.text(
`🔒 *All Anti-Filters Enabled*

${ANTI_KEYS.length} filters are now active.

━━━━━━━━━━━━━━

🐺 Powered by Kenya-Ultra 👑`
        );

    }

};
