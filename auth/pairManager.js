import crypto from "crypto";

import { createSocket } from "./baileys.js";
import { createSession } from "./sessionManager.js";

function generateSessionId() {

    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

    let id = "KU_";

    for (let i = 0; i < 16; i++) {
        id += chars[Math.floor(Math.random() * chars.length)];
    }

    return id;
}

export async function generatePair(phone) {

    const sessionId = generateSessionId();

    const folder = createSession(sessionId);

    const sock = await createSocket(folder);

    return new Promise((resolve, reject) => {

        sock.ev.on("connection.update", async (update) => {

            try {

                const {
                    connection,
                    qr
                } = update;

                if (connection === "open") {

                    console.log("WhatsApp Connected");

                }

                if (!sock.authState?.creds?.registered) {

                    const pairCode = await sock.requestPairingCode(phone);

                    resolve({
                        success: true,
                        sessionId,
                        pairCode
                    });

                }

            } catch (err) {

                reject(err);

            }

        });

    });

                       }
