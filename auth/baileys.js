import makeWASocket, {
    DisconnectReason,
    fetchLatestBaileysVersion,
    useMultiFileAuthState
} from "@whiskeysockets/baileys";

import P from "pino";

export async function createSocket(sessionPath) {

    const { state, saveCreds } = await useMultiFileAuthState(sessionPath);

    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({

        version,

        auth: state,

        logger: P({
            level: "silent"
        }),

        printQRInTerminal: false,

        browser: [
            "Kenya-Ultra",
            "Chrome",
            "1.0.0"
        ],

        syncFullHistory: false,

        markOnlineOnConnect: true,

        generateHighQualityLinkPreview: true

    });

    sock.ev.on("creds.update", async () => {
        await saveCreds();
    });

    sock.ev.on("connection.update", ({ connection, lastDisconnect }) => {

        if (connection === "open") {
            console.log("✅ WhatsApp Connected");
        }

        if (connection === "close") {

            const shouldReconnect =
                lastDisconnect?.error?.output?.statusCode !==
                DisconnectReason.loggedOut;

            if (shouldReconnect) {
                console.log("🔄 Reconnecting...");
            } else {
                console.log("❌ Session Logged Out");
            }

        }

    });

    return sock;

}
