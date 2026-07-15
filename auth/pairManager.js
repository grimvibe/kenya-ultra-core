import { createSocket } from "./baileys.js";
import { createSession } from "./sessionManager.js";
import { generateSessionId } from "../utils/idGenerator.js";

export async function generatePair(phone) {

    const sessionId = generateSessionId();

    const sessionFolder = createSession(sessionId);

    const sock = await createSocket(sessionFolder);

    let pairGenerated = false;

    return new Promise((resolve, reject) => {

        const timeout = setTimeout(() => {

            reject(new Error("Pairing request timed out."));

        }, 120000);

        sock.ev.on("connection.update", async (update) => {

            try {

                const { connection } = update;

                // Generate Pair Code only once
                if (!pairGenerated) {

                    pairGenerated = true;

                    const pairCode = await sock.requestPairingCode(phone);

                    resolve({
                        success: true,
                        sessionId,
                        pairCode,
                        socket: sock
                    });

                }

                if (connection === "open") {

                    clearTimeout(timeout);

                    console.log("✅ WhatsApp Connected");

                }

                if (connection === "close") {

                    console.log("❌ Connection Closed");

                }

            } catch (error) {

                clearTimeout(timeout);

                reject(error);

            }

        });

    });

}
