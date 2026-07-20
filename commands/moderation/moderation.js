import Reply from "../../utils/reply.js";
import { getGroupSettings } from "../../settings/settingsStore.js";

export default {

    name: "moderation",

    description: "Display moderation settings.",

    category: "Moderation",

    async execute(ctx) {

        if (!ctx.isGroup)
            return Reply.error(
                "Group only command."
            );

        const settings =
            await getGroupSettings(ctx.chat);

        return Reply.text(

`╭⊷ 🛡️ *GROUP MODERATION*
│
├⊷ 🚫 Anti-Link : ${settings.antilink ? "✅ ON" : "❌ OFF"}
├⊷ 🤖 Anti-Bot : ${settings.antibot ? "✅ ON" : "❌ OFF"}
├⊷ 👻 Anti-Delete : ${settings.antidelete ? "✅ ON" : "❌ OFF"}
├⊷ ✏️ Anti-Edit : ${settings.antiedit ? "✅ ON" : "❌ OFF"}
├⊷ 👁️ Anti-ViewOnce : ${settings.antiviewonce ? "✅ ON" : "❌ OFF"}
├⊷ ⚡ Anti-Spam : ${settings.antispam ? "✅ ON" : "❌ OFF"}
├⊷ 🤬 Anti-BadWord : ${settings.antibadword ? "✅ ON" : "❌ OFF"}
├⊷ 👋 Welcome : ${settings.welcome ? "✅ ON" : "❌ OFF"}
├⊷ 👋 Goodbye : ${settings.goodbye ? "✅ ON" : "❌ OFF"}
│
╰⊷ 🐺 *Powered by Kenya-Ultra 👑*`

        );

    }

};
