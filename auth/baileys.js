import makeWASocket, {
    fetchLatestBaileysVersion,
    Browsers
} from "baileys";

import P from "pino";
import { useMemoryAuthState } from "./memoryAuthState.js";

export async function createSocket(existingAuthState = null) {

    const authState = existingAuthState || useMemoryAuthState();

    const { version } = await fetchLatestBaileysVersion();

    console.log("📦 Using WhatsApp Web Version:", version.join("."));

    const sock = makeWASocket({
        version,
        auth: authState.state,

        logger: P({
            level: "silent"
        }),

        printQRInTerminal: false,

        browser: Browsers.ubuntu("Chrome"),

        syncFullHistory: false,

        markOnlineOnConnect: false,

        keepAliveIntervalMs: 30000,

        retryRequestDelayMs: 250,

        defaultQueryTimeoutMs: 60000
    });

    let saveTimer = null;

    sock.ev.on("creds.update", async () => {
        try {
            await authState.saveCreds();

            // Always keep the latest snapshot
            authState.latestSnapshot = authState.getSnapshot();

            // Debounce multiple updates
            clearTimeout(saveTimer);

            saveTimer = setTimeout(() => {
                authState.latestSnapshot = authState.getSnapshot();
                console.log("✅ Auth snapshot updated.");
            }, 5000);

        } catch (err) {
            console.error("❌ Failed to save credentials:", err);
        }
    });

    sock.ev.on("connection.update", ({ connection, lastDisconnect }) => {

        if (connection) {
            console.log("📡 Connection State:", connection);
        }

        if (lastDisconnect?.error) {
            console.log("📛 Disconnect Reason:", lastDisconnect.error);
        }

    });

    return {
        sock,
        authState,

        getSnapshot() {
            return authState.latestSnapshot || authState.getSnapshot();
        }
    };
}
