import { DisconnectReason } from "baileys";
import { createSocket } from "./baileys.js";
import { createSession } from "./sessionManager.js";
import { generateSessionId } from "../utils/idGenerator.js";
import { encodeSession } from "../utils/sessionEncoder.js";
import messageSender from "./messageSender.js";
import jobManager from "./jobManager.js";

export async function generatePair(phone, jobId) {
    const sessionId = generateSessionId();

    // Metadata bookkeeping only — auth state itself now lives in
    // memory (see auth/memoryAuthState.js), not on disk.
    createSession(sessionId);

    return new Promise((resolve, reject) => {
        let codeSettled = false;
        let pairCode = null;
        let sock = null;
        let authState = null;

        // Prevent sending SESSION_ID multiple times
        let sessionDelivered = false;

        const codeTimeout = setTimeout(() => {
            if (!codeSettled) {
                codeSettled = true;
                try {
                    sock?.end();
                } catch (_) {}

                jobManager.update(jobId, {
                    status: "failed"
                });

                reject(new Error("Pairing request timed out."));
            }
        }, 60000);

        const finishCode = (err, result) => {
            if (codeSettled) return;

            codeSettled = true;
            clearTimeout(codeTimeout);

            if (err) {
                jobManager.update(jobId, {
                    status: "failed"
                });

                reject(err);
            } else {
                resolve(result);
            }
        };

        const connect = async () => {
            // Reuse the same authState across reconnect attempts so
            // identity keys generated on the first attempt survive.
            const created = await createSocket(authState);
            sock = created.sock;
            authState = created.authState;

            if (!authState.state.creds?.registered && !pairCode) {
                (async () => {
                    try {
                        await new Promise((r) => setTimeout(r, 3000));

                        pairCode = await sock.requestPairingCode(phone);

                        console.log(`🔑 Pair code generated for ${phone}: ${pairCode}`);

                        finishCode(null, {
                            success: true,
                            sessionId,
                            pairCode,
                            socket: sock
                        });

                    } catch (err) {
                        finishCode(err);
                    }
                })();
            }

            sock.ev.on("connection.update", async (update) => {
                const { connection, lastDisconnect } = update;

                console.log("Connection Update:", connection);

                if (connection === "open") {

                    console.log("✅ WhatsApp Connected");

                    // SESSION_ID already sent before?
                    if (sessionDelivered) {
                        console.log("⚠ SESSION_ID already delivered. Ignoring duplicate connection.");

                        try {
                            sock.end();
                        } catch (_) {}

                        return;
                    }

                    sessionDelivered = true;

                    // Full snapshot — creds AND keys — so the client
                    // gets everything Baileys generated during pairing.
                    const sessionString = encodeSession(authState.getSnapshot());

                    await messageSender.sendSessionId(
                        sock,
                        phone,
                        sessionString
                    );

                    jobManager.update(jobId, {
                        status: "connected",
                        sessionId: sessionString
                    });

                    console.log(`✅ SESSION_ID delivered to ${phone}`);

                    try {
                        sock.end();
                    } catch (_) {}
                }

                if (connection === "close") {

                    const statusCode =
                        lastDisconnect?.error?.output?.statusCode;

                    const loggedOut =
                        statusCode === DisconnectReason.loggedOut;

                    console.log("❌ Connection Closed", statusCode);

                    if (loggedOut) {

                        finishCode(
                            new Error(
                                "Device was logged out during pairing."
                            )
                        );

                        jobManager.update(jobId, {
                            status: "failed"
                        });

                        return;
                    }

                    // Don't reconnect after SESSION_ID has already been sent
                    if (sessionDelivered) {
                        console.log("✅ Pairing complete. Not reconnecting.");
                        return;
                    }

                    if (!pairCode) {

                        finishCode(
                            new Error("Connection Closed")
                        );

                        return;
                    }

                    console.log("🔄 Restarting connection to complete pairing...");

                    connect();
                }
            });
        };

        connect();
    });
}
