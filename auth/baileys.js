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
        logger: P({ level: "silent" }),
        printQRInTerminal: false,
        browser: ["Kenya-Ultra", "Chrome", "1.0.0"]
    });

    sock.ev.on("creds.update", saveCreds);

    return sock;

}
