import {

    getGroupSettings,

    setGroupSetting

} from "../settings/settingsStore.js";

import Reply from "../utils/reply.js";

const FEATURES = {

    antilink: {

        title: "Anti-Link",

        supportsAction: true

    },

    antibot: {

        title: "Anti-Bot",

        supportsAction: true

    },

    antispam: {

        title: "Anti-Spam",

        supportsAction: true

    },

    antibadword: {

        title: "Anti-BadWord",

        supportsAction: true

    },

    antidelete: {

        title: "Anti-Delete",

        supportsAction: false

    },

    antiedit: {

        title: "Anti-Edit",

        supportsAction: false

    },

    antibeg: {

        title: "Anti-Beg",

        supportsAction: false

    },

    antisticker: {

        title: "Anti-Sticker",

        supportsAction: false

    },

    antivoice: {

        title: "Anti-Voice",

        supportsAction: false

    },

    antifile: {

        title: "Anti-File",

        supportsAction: false

    },

    antiphoto: {

        title: "Anti-Photo",

        supportsAction: false

    },

    antivideo: {

        title: "Anti-Video",

        supportsAction: false

    },

    antiemoji: {

        title: "Anti-Emoji",

        supportsAction: false

    },

    antitag: {

        title: "Anti-Tag",

        supportsAction: false

    },

    antimention: {

        title: "Anti-Mention",

        supportsAction: false

    },

    antipoll: {

        title: "Anti-Poll",

        supportsAction: false

    },

    antigif: {

        title: "Anti-Gif",

        supportsAction: false

    },

    antiforwarded: {

        title: "Anti-Forwarded",

        supportsAction: false

    },

    antilocation: {

        title: "Anti-Location",

        supportsAction: false

    },

    anticontact: {

        title: "Anti-Contact",

        supportsAction: false

    },

    antisale: {

        title: "Anti-Sale",

        supportsAction: false

    },

    antinum: {

        title: "Anti-Num",

        supportsAction: false

    },

    autoapprove: {

        title: "Auto-Approve",

        supportsAction: false

    },

    autoreject: {

        title: "Auto-Reject",

        supportsAction: false

    },

    

    welcome: {

        title: "Welcome",

        supportsAction: false

    },

    goodbye: {

        title: "Goodbye",

        supportsAction: false

    }

};

export async function toggleFeature(ctx, feature) {

    if (!ctx.isGroup)

        return Reply.error(

            "This command can only be used in groups."

        );

    if (!ctx.isAdmin)

        return Reply.error(

            "Only group admins can use this command."

        );

    const config = FEATURES[feature];

    if (!config)

        return Reply.error("Unknown feature.");

    const option =

        (ctx.args[0] || "status").toLowerCase();

    const settings =

        await getGroupSettings(ctx.chat);

    const current = settings[feature];

    if (option === "on") {

        current.enabled = true;

    }

    else if (option === "off") {

        current.enabled = false;

    }

    else if (

        config.supportsAction &&

        ["delete","warn","kick"].includes(option)

    ) {

        current.enabled = true;

        current.action = option;

    }

    else if (

        option !== "status"

    ) {

        return Reply.error(

            config.supportsAction

                ? "Use: on | off | status | delete | warn | kick"

                : "Use: on | off | status"

        );

    }

    await setGroupSetting(

        ctx.chat,

        feature,

        current

    );

    let text =

`╭⊷ 🛡️ *${config.title.toUpperCase()}*
│
├⊷ 📌 Status : ${current.enabled ? "✅ ON" : "❌ OFF"}`;

    if (config.supportsAction) {

        const emoji = {

            delete: "🗑️",

            warn: "⚠️",

            kick: "👢"

        };

        text += `

├⊷ ⚙️ Action : ${emoji[current.action]} ${current.action.toUpperCase()}`;

    }

    text += `

│
╰⊷ 🐺 *Powered by Kenya-Ultra 👑*`;

    return Reply.text(text);

}
