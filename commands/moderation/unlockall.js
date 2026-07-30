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

    name: "unlockall",

    description: "Turn off every anti-filter at once.",

    category: "Moderation",

    usage: ".unlockall",

    async execute(ctx) {

        if (!ctx.isGroup)
            return Reply.error("This command can only be used in groups.");

        if (!ctx.isAdmin)
            return Reply.error("Only group admins can use this command.");

        const settings = await getGroupSettings(ctx.chat);

        for (const key of ANTI_KEYS) {

            const current = settings[key] || { enabled: false };
            current.enabled = false;

            await setGroupSetting(ctx.chat, key, current);

        }

        return Reply.text(
`🔓 *All Anti-Filters Disabled*

${ANTI_KEYS.length} filters are now off.

━━━━━━━━━━━━━━

🐺 Powered by Kenya-Ultra 👑`
        );

    }

};
