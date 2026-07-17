import { getCommands } from "./index.js";

export default {
    name: "menu",
    description: "Display the Kenya-Ultra command menu.",
    category: "General",

    async execute(sock, msg) {

        const commands = getCommands();

        const grouped = {};

        for (const command of commands) {

            const category = command.category || "Other";

            if (!grouped[category]) {
                grouped[category] = [];
            }

            grouped[category].push(command);

        }

        let menu = `╭━━━〔 🤖 Kenya-Ultra 〕━━━⬣

Welcome to Kenya-Ultra

━━━━━━━━━━━━━━

`;

        for (const category of Object.keys(grouped).sort()) {

            menu += `📂 *${category}*\n`;

            grouped[category]
                .sort((a, b) => a.name.localeCompare(b.name))
                .forEach(cmd => {
                    menu += `• .${cmd.name}\n`;
                });

            menu += "\n";

        }

        menu += `━━━━━━━━━━━━━━

📊 Total Commands: ${commands.length}

⚡ Kenya-Ultra Core
🚀 Version: 1.0.0

Powered by Kenya-Ultra 💚`;

        await sock.sendMessage(
            msg.key.remoteJid,
            {
                text: menu
            }
        );

    }

};
