import os from "os";
import process from "process";
import Reply from "../utils/reply.js";
import { getCommands } from "./index.js";

export default {
    name: "ping",
    description: "Check bot speed and system status.",
    category: "General",

    async execute(message) {

        const uptime = process.uptime();

        const hours = Math.floor(uptime / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        const seconds = Math.floor(uptime % 60);

        const memory = process.memoryUsage();

        const usedMB = (memory.heapUsed / 1024 / 1024).toFixed(2);
        const totalMB = (memory.heapTotal / 1024 / 1024).toFixed(2);

        const commandCount = getCommands().length;

        const diagnostics = `🏓 *Kenya-Ultra Diagnostics*

━━━━━━━━━━━━━━

👤 User
${message.pushName || "Unknown"}

⚡ Response
Online

🖥 Platform
${os.platform()} (${os.arch()})

💻 Node.js
${process.version}

⏳ Uptime
${hours}h ${minutes}m ${seconds}s

💾 Memory
${usedMB} MB / ${totalMB} MB

📦 Commands
${commandCount}

🟢 Core Status
Online

🚀 Kenya-Ultra v1.0.0

━━━━━━━━━━━━━━

Powered by Kenya-Ultra 💚`;

        return Reply.text(diagnostics);

    }

};
