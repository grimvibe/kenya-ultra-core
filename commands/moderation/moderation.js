import Reply from "../../utils/reply.js";
import { getGroupSettings } from "../../settings/settingsStore.js";

export default {

    name: "moderation",

    description: "Display group moderation settings.",

    category: "Moderation",

    async execute(ctx) {

        if (!ctx.isGroup)

            return Reply.error(
                "This command can only be used in groups."
            );

        const settings =
            await getGroupSettings(ctx.chat);

        const status = (feature) =>
            feature.enabled ? "✅ ON" : "❌ OFF";

        let text =
`╭⊷ 🛡️ *GROUP MODERATION*
│
├⊷ 🚫 Anti-Link : ${status(settings.antilink)}
├⊷ 🤖 Anti-Bot : ${status(settings.antibot)}
├⊷ 👻 Anti-Delete : ${status(settings.antidelete)}
├⊷ ✏️ Anti-Edit : ${status(settings.antiedit)}
├⊷ 👁️ Anti-ViewOnce : ${status(settings.antiviewonce)}
├⊷ ⚡ Anti-Spam : ${status(settings.antispam)}
├⊷ 🤬 Anti-BadWord : ${status(settings.antibadword)}
├⊷ 👋 Welcome : ${status(settings.welcome)}
├⊷ 👋 Goodbye : ${status(settings.goodbye)}
│
╰⊷ 🐺 *Powered by Kenya-Ultra 👑*`;

        return Reply.text(text);

    }

};
