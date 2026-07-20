import {

    getGroupSettings,

    setGroupSetting

} from "../settings/settingsStore.js";

import Reply from "../utils/reply.js";

export async function toggleFeature(ctx, feature, title) {

    if (!ctx.isGroup)
        return Reply.error(
            "This command can only be used in groups."
        );

    if (!ctx.isAdmin)
        return Reply.error(
            "Only group admins can use this command."
        );

    const option =
        (ctx.args[0] || "status").toLowerCase();

    const settings =
        await getGroupSettings(ctx.chat);

    if (option === "on") {

        await setGroupSetting(
            ctx.chat,
            feature,
            true
        );

        settings[feature] = true;

    }

    else if (option === "off") {

        await setGroupSetting(
            ctx.chat,
            feature,
            false
        );

        settings[feature] = false;

    }

    const status =
        settings[feature]
            ? "✅ ON"
            : "❌ OFF";

    return Reply.text(

`╭⊷ 🛡️ *${title.toUpperCase()}*
│
├⊷ 📌 *Status:* ${status}
│
╰⊷ 🐺 *Powered by Kenya-Ultra 👑*`

    );

}
