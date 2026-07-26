import makeWASocket, {
    fetchLatestBaileysVersion,
    Browsers
} from "baileys";

import P from "pino";
import { useMemoryAuthState } from "./memoryAuthState.js";

export async function createSocket(existingAuthState = null) {

    // Reuse the exact same auth state object across reconnects —
    // Baileys mutates it in place, so there's no need to snapshot
    // and rebuild it (doing so was corrupting key types on reconnect).
    const authState = existingAuthState || useMemoryAuthState();

    // Always use the latest WhatsApp Web version.
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

        // Better during pairing
        markOnlineOnConnect: false,

        // Helps keep the socket alive during authentication
        keepAliveIntervalMs: 30000,

        // Avoids some unnecessary retries
        retryRequestDelayMs: 250,

        // Faster message retries
        defaultQueryTimeoutMs: 60000

    });

    // Baileys updates creds continuously while pairing.
    sock.ev.on("creds.update", async () => {

        try {

            await authState.saveCreds();

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

        authState

    };

}
