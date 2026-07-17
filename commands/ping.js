import os from "os";
import process from "process";
import { getCommands } from "./index.js";

export default {
    name: "ping",
    description: "Check bot speed and system status.",
    category: "General",

    async execute(sock, msg) {

        const start = Date.now();

        const latency = Date.now() - start;

        const uptime = process.uptime();

        const hours = Math.floor(uptime / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        const seconds = Math.floor(uptime % 60);

        const memory = process.memoryUsage();

        const usedMB = (memory.heapUsed / 1024 / 1024).toFixed(2);
        const totalMB = (memory.heapTotal / 1024 / 1024).toFixed(2);

        const commandCount = getCommands().length;

        const message = `🏓 *Kenya-Ultra Diagnostics*

━━━━━━━━━━━━━━

⚡ *Response Time*
${latency} ms

🖥 *Platform*
${os.platform()} (${os.arch()})

💻 *Node.js*
${process.version}

⏳ *Uptime*
${hours}h ${minutes}m ${seconds}s

💾 *Memory Usage*
${usedMB} MB / ${totalMB} MB

📦 *Loaded Commands*
${commandCount}

🟢 *Core Status*
Online

🚀 *Kenya-Ultra Version*
v1.0.0

━━━━━━━━━━━━━━

Powered by Kenya-Ultra 💚`;

        await sock.sendMessage(
            msg.key.remoteJid,
            {
                text: message
            }
        );

    }

};
