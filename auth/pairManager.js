import { DisconnectReason } from "baileys";
import { createSocket } from "./baileys.js";
import { createSession } from "./sessionManager.js";
import { generateSessionId } from "../utils/idGenerator.js";

export async function generatePair(phone) {
    const sessionId = generateSessionId();
    const sessionFolder = createSession(sessionId);

    return new Promise((resolve, reject) => {
        let settled = false;
        let pairCode = null;
        let sock = null;

        const timeout = setTimeout(() => {
            if (!settled) {
                settled = true;
                try { sock?.end(); } catch (_) {}
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

        const connect = async () => {
            sock = await createSocket(sessionFolder);

            // Only request a pairing code if this connection isn't already
            // registered. On the very first connect, creds.registered is
            // false, so we request a code. On the reconnect that follows a
            // successful pairing (WhatsApp's "restart required" 515 close),
            // creds.registered is now true, so we skip straight to waiting
            // for "open" instead of asking for a brand new code.
            if (!sock.authState?.creds?.registered && !pairCode) {
                (async () => {
                    try {
                        await new Promise((r) => setTimeout(r, 3000));
                        pairCode = await sock.requestPairingCode(phone);
                        console.log(`🔑 Pair code generated for ${phone}: ${pairCode}`);
                    } catch (err) {
                        finish(err);
                    }
                })();
            }

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
                    const statusCode = lastDisconnect?.error?.output?.statusCode;
                    const loggedOut = statusCode === DisconnectReason.loggedOut;

                    console.log("❌ Connection Closed", statusCode);

                    if (loggedOut) {
                        finish(new Error("Device was logged out during pairing."));
                        return;
                    }

                    if (!pairCode) {
                        // Closed before a code was ever issued — genuine failure,
                        // don't retry silently.
                        finish(new Error("Connection Closed"));
                        return;
                    }

                    // A pair code was already issued, so this close is almost
                    // certainly WhatsApp's expected "restart required" signal
                    // (stream:error code 515) after a successful pairing.
                    // Reconnect using the same session folder — creds are now
                    // registered, so this completes the handshake.
                    console.log("🔄 Restarting connection to complete pairing...");
                    connect();
                }
            });
        };

        connect();
    });
            }
