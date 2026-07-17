import Reply from "../utils/reply.js";
import { getCommands } from "./commandStore.js";

export default {
    name: "menu",
    description: "Display the Kenya-Ultra command menu.",
    category: "General",

    async execute(message) {

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

Welcome ${message.pushName || "User"} 👋

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

📊 *Statistics*

• Total Commands : ${commands.length}
• Version : v1.0.0
• Status : 🟢 Online

━━━━━━━━━━━━━━

💚 Powered by Kenya-Ultra
⚡ Fast • Secure • Reliable`;

        return Reply.text(menu);

    }

};
