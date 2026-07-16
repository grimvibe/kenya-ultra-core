import { createSocket } from "./baileys.js";
import { createSession } from "./sessionManager.js";
import { generateSessionId } from "../utils/idGenerator.js";

export async function generatePair(phone) {
    const sessionId = generateSessionId();
    const sessionFolder = createSession(sessionId);

    const sock = await createSocket(sessionFolder);

    return new Promise((resolve, reject) => {
        let settled = false;
        let pairCode = null;

        const timeout = setTimeout(() => {
            if (!settled) {
                settled = true;
                reject(new Error("Pairing request timed out."));
            }
        }, 120000);

        const finish = (err, result) => {
            if (settled) return;
            settled = true;
            clearTimeout(timeout);
            if (err) reject(err);
            else resolve(result);
        };

        // Request the pairing code once the socket is created.
        // requestPairingCode() internally waits for the underlying
        // connection to be ready before it sends the request, so we
        // do NOT gate this on a connection.update event (which fires
        // almost immediately, before the noise handshake finishes,
        // and was causing premature 401 failures).
        (async () => {
            try {
                if (!sock.authState?.creds?.registered) {
                    // Small buffer to let the socket start connecting
                    // before we ask for a pairing code.
                    await new Promise((r) => setTimeout(r, 3000));

                    pairCode = await sock.requestPairingCode(phone);

                    console.log(`🔑 Pair code generated for ${phone}: ${pairCode}`);
                }
            } catch (err) {
                finish(err);
            }
        })();

        sock.ev.on("connection.update", (update) => {
            const { connection, lastDisconnect } = update;

            console.log("Connection Update:", connection);

            if (connection === "open") {
                console.log("✅ WhatsApp Connected");

                finish(null, {
                    success: true,
                    sessionId,
                    pairCode,
                    socket: sock
                });
            }

            if (connection === "close") {
                console.log("❌ Connection Closed");
                console.dir(lastDisconnect, { depth: null });

                // If we never managed to hand back a pair code, this
                // attempt failed outright. If we already have a pair
                // code, let the caller keep waiting/reconnecting —
                // don't reject just because of a mid-pairing close.
                if (!pairCode) {
                    finish(new Error("Connection Closed"));
                }
            }
        });
    });
}
