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

        let menu = `╭━━━〔 🤖 Kenya-Ultra 〕━━━⬣

👋 Welcome *${message.pushName || "User"}*

━━━━━━━━━━━━━━

👑 Owner : ${owner}
⚡ Version : v${version}
🟢 Status : Online
🧠 RAM : ${ram}
⏱️ Uptime : ${uptimeText}
📅 Date : ${date}
🕒 Time : ${time}

━━━━━━━━━━━━━━

`;

        // =========================
        // Categories
        // =========================

        for (const category of Object.keys(grouped).sort()) {

            menu += `📂 *${category}*\n`;

            grouped[category]
                .sort((a, b) => a.name.localeCompare(b.name))
                .forEach(cmd => {
                    menu += `• .${cmd.name}\n`;
                });

            menu += "\n";

        }

        // =========================
        // Footer
        // =========================

        menu += `━━━━━━━━━━━━━━

📊 *Bot Statistics*

📦 Commands : ${commands.length}
📂 Categories : ${Object.keys(grouped).length}
⚙️ Prefix : .
🌐 Platform : WhatsApp

━━━━━━━━━━━━━━

💚 Kenya-Ultra
⚡ Fast • Secure • Reliable

━━━━━━━━━━━━━━

© 2026 Kenya-Ultra`;

        return {
            action: "reply",
            reply: {
                type: "image",
                file: "menu.jpg",
                caption: menu
            }
        };

    }

};
