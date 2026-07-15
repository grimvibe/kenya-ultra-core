import { createSocket } from "./baileys.js";
import { createSession } from "./sessionManager.js";
import { generateSessionId } from "../utils/idGenerator.js";

export async function generatePair(phone) {
    const sessionId = generateSessionId();
    const sessionFolder = createSession(sessionId);

    const sock = await createSocket(sessionFolder);

    return new Promise((resolve, reject) => {
        let pairGenerated = false;

        const timeout = setTimeout(() => {
            reject(new Error("Pairing request timed out."));
        }, 120000);

        sock.ev.on("connection.update", async (update) => {
            const { connection, lastDisconnect, qr } = update;

            console.log("Connection Update:", update);

            try {
                // Wait until the socket is ready
                if (
                    !pairGenerated &&
                    sock.authState?.creds &&
                    !sock.authState.creds.registered
                ) {
                    pairGenerated = true;

                    const pairCode = await sock.requestPairingCode(phone);

                    clearTimeout(timeout);

                    return resolve({
                        success: true,
                        sessionId,
                        pairCode,
                        socket: sock
                    });
                }

                if (connection === "open") {
                    console.log("✅ WhatsApp Connected");
                }

                if (connection === "close") {
                    console.log("❌ Connection Closed");
                    console.dir(lastDisconnect, { depth: null });

                    if (!pairGenerated) {
                        clearTimeout(timeout);
                        reject(new Error("Connection Closed"));
                    }
                }
            } catch (err) {
                clearTimeout(timeout);
                reject(err);
            }
        });
    });
}
