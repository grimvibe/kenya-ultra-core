import { assetUrl } from "../utils/assetUrl.js";

export default {
    name: "menu",
    description: "Display the Kenya-Ultra command menu.",
    category: "General",

    async execute(message) {

        const { getCommands } = await import("./commandStore.js");

        const commands = getCommands();

        const grouped = {};

        for (const command of commands) {

            const category = command.category || "Other";

            if (!grouped[category]) {
                grouped[category] = [];
            }

            grouped[category].push(command);

        }

        // =========================
        // Bot Statistics
        // =========================

        const uptime = process.uptime();

        const days = Math.floor(uptime / 86400);
        const hours = Math.floor((uptime % 86400) / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        const seconds = Math.floor(uptime % 60);

        const uptimeText =
            `${days}d ${hours}h ${minutes}m ${seconds}s`;

        const now = new Date();

        const date = now.toLocaleDateString("en-GB", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        });

        const time = now.toLocaleTimeString("en-GB");

        const ram =
            `${Math.round(process.memoryUsage().rss / 1024 / 1024)} MB`;

        const owner =
            process.env.OWNER_NAME || "Lawrence";

        const version =
            process.env.VERSION || "1.0.0";

        // =========================
        // Header
        // =========================

        let menu = `🟢🟣🔵🟠🟡🔴🟢🟣🔵🟠🟡🔴

🤖 *KENYA-ULTRA* ⌁ CORE
✨ 𝘺𝘰𝘶𝘳 𝘢𝘭𝘭-𝘪𝘯-𝘰𝘯𝘦 𝘸𝘩𝘢𝘵𝘴𝘢𝘱𝘱 𝘢𝘴𝘴𝘪𝘴𝘵𝘢𝘯𝘵 🚀

🟢🟣🔵🟠🟡🔴🟢🟣🔵🟠🟡🔴

› hey *${message.pushName || "User"}*, systems are up

\`\`\`
owner    ${owner}
version  v${version}
status   ● online
ram      ${ram}
uptime   ${uptimeText}
date     ${date}
time     ${time}
\`\`\`

`;

        // =========================
        // Categories
        // =========================

        for (const category of Object.keys(grouped).sort()) {

            menu += `┌─⌁ *${category.toUpperCase()}*\n`;

            grouped[category]
                .sort((a, b) => a.name.localeCompare(b.name))
                .forEach(cmd => {
                    menu += `│ › .${cmd.name}\n`;
                });

            menu += "└─\n\n";

        }

        // =========================
        // Footer
        // =========================

        menu += `\`\`\`
commands    ${commands.length}
categories  ${Object.keys(grouped).length}
prefix      .
platform    whatsapp
\`\`\`

⚡ fast • secure • reliable
© 2026 Kenya-Ultra`;

        return {
            action: "reply",
            reply: {
                type: "image",
                url: assetUrl("images/menu.jpg"),
                caption: menu
            }
        };

    }

};
                
