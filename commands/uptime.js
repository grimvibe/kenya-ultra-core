import Reply from "../utils/reply.js";

function formatUptime(seconds) {

    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    const parts = [];

    if (days) parts.push(`${days}d`);
    if (hours) parts.push(`${hours}h`);
    if (minutes) parts.push(`${minutes}m`);
    parts.push(`${secs}s`);

    return parts.join(" ");

}

export default {

    name: "uptime",

    aliases: ["up"],

    description: "Show how long the bot has been running.",

    category: "General",

    usage: ".uptime",

    async execute() {

        const readable = formatUptime(process.uptime());

        return Reply.text(
`╭⊷ 🐺 *KENYA-ULTRA*

│

├⊷ ⏱️ *Uptime:* ${readable}

│

╰⊷ Still going strong 💪`
        );

    }

};
