import { createSocket } from "./baileys.js";
import { createSession } from "./sessionManager.js";
import { generateSessionId } from "../utils/idGenerator.js";

export async function generatePair(phone) {

    const sessionId = generateSessionId();

    const sessionFolder = createSession(sessionId);

    const sock = await createSocket(sessionFolder);

    return new Promise(async (resolve, reject) => {

        let resolved = false;

        const timeout = setTimeout(() => {

            if (!resolved) {
                reject(new Error("Pairing request timed out."));
            }

        }, 120000);

        sock.ev.on("connection.update", async (update) => {

            const { connection, lastDisconnect } = update;

            console.log("Connection Update:", update);

            if (connection === "connecting") {

                try {

                    if (!resolved) {

                        const pairCode = await sock.requestPairingCode(phone);

                        resolved = true;

                        clearTimeout(timeout);

                        resolve({
                            success: true,
                            sessionId,
                            pairCode,
                            socket: sock
                        });

                    }

                } catch (err) {

                    clearTimeout(timeout);

                    reject(err);

                }

            }

            if (connection === "open") {

                console.log("✅ WhatsApp Connected");

            }

            if (connection === "close") {

                console.log("❌ Connection Closed");

                console.log("Disconnect Reason:");

                console.dir(lastDisconnect, { depth: null });

            }

        });

    });

}
