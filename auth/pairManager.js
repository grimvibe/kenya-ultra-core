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
            finish(new Error("Pairing request timed out."));
        }, 120000);

        function finish(err, result) {
            if (settled) return;

            settled = true;
            clearTimeout(timeout);

            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        }

        // Generate Pair Code
        (async () => {
            try {

                // Give Baileys a moment to establish the initial connection
                await new Promise(resolve => setTimeout(resolve, 1500));

                pairCode = await sock.requestPairingCode(phone);

                console.log(`🔑 Pair Code Generated for ${phone}: ${pairCode}`);

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

                if (lastDisconnect) {
                    console.dir(lastDisconnect, { depth: null });
                }

                // Only fail if we never managed to generate a Pair Code
                if (!pairCode) {
                    finish(new Error("WhatsApp connection closed before Pair Code generation."));
                }

            }

        });

    });
}
