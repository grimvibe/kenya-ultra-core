import process from "process";
import Reply from "../utils/reply.js";
import { buildAdCard } from "../utils/card.js";
import { assetUrl } from "../utils/assetUrl.js";

// =========================
// Signal quality bar
// =========================

function getSignal(ms) {

    if (ms < 150) return { bar: "▰▰▰▰▰▱", label: "Excellent" };
    if (ms < 400) return { bar: "▰▰▰▰▱▱", label: "Good" };
    if (ms < 800) return { bar: "▰▰▰▱▱▱", label: "Fair" };

    return { bar: "▰▰▱▱▱▱", label: "Slow" };

}

function formatUptime(uptime) {

    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);

    return `${hours}h ${minutes}m ${seconds}s`;

}

export default {
    name: "ping",
    description: "Check bot speed and system status.",
    category: "General",

    async execute(message) {

        const start = process.hrtime.bigint();

        // Prefer real round-trip latency from the incoming message timestamp
        let latencyMs = null;
        const ts = message?.rawMessage?.messageTimestamp;

        if (ts) {
            const sentAt = Number(ts) * 1000;
            const diff = Date.now() - sentAt;
            if (diff >= 0 && diff < 60000) latencyMs = diff;
        }

        if (latencyMs === null) {
            const end = process.hrtime.bigint();
            latencyMs = Number(end - start) / 1e6;
        }

        const ms = Math.max(1, Math.round(latencyMs));
        const secs = (ms / 1000).toFixed(2);
        const { bar, label } = getSignal(ms);

        const text = `🛰️ *KENYA-ULTRA* ⌁ PONG

\`\`\`
◇ latency   ${ms}ms (${secs}s)
◇ signal    ${bar}  ${label}
◇ status    ● ONLINE
◇ uptime    ${formatUptime(process.uptime())}
\`\`\`

⚡ system nominal`;

        const contextInfo = buildAdCard({
            title: "🛰️ KENYA-ULTRA ⌁ PONG",
            body: `${ms}ms (${secs}s) · ${label}`,
            thumbnailUrl: assetUrl("images/alive.jpg")
        });

        return Reply.text(text, [], contextInfo);

    }

};
