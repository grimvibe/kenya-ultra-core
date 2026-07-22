import { DisconnectReason } from "baileys";
import { createSocket } from "./baileys.js";
import { generateSessionId } from "../utils/idGenerator.js";
import { saveAuth } from "./sessionStore.js";
import messageSender from "./messageSender.js";
import jobManager from "./jobManager.js";

export async function generatePair(phone, jobId) {
    const sessionId = generateSessionId();

    return new Promise((resolve, reject) => {
        let codeSettled = false;
        let pairCode = null;
        let sock = null;
        let authState = null;

        // Prevent sending SESSION_ID multiple times
        let sessionDelivered = false;

        // Guard against endless reconnect loops (e.g. if the platform
        // is throttling us and every attempt fails with 428/etc).
        let reconnectAttempts = 0;
        const MAX_RECONNECT_ATTEMPTS = 6;

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

                    try {

                        // Store the full { creds, keys } snapshot in Redis,
                        // keyed by the short sessionId. The user only ever
                        // sees/copies the short ID.
                        await saveAuth(sessionId, authState.getSnapshot());

                        await messageSender.sendSessionId(
                            sock,
                            phone,
                            sessionId
                        );

                        jobManager.update(jobId, {
                            status: "connected",
                            sessionId
                        });

                        console.log(`✅ SESSION_ID delivered to ${phone}`);

                    } catch (err) {

                        console.error("❌ Failed to save session:", err);

                        jobManager.update(jobId, {
                            status: "failed"
                        });

                    }

                    try {
                        sock.end();
                    } catch (_) {}
                }

                if (connection === "close") {

                    const statusCode =
                        lastDisconnect?.error?.output?.statusCode;

                    const loggedOut =
                        statusCode === DisconnectReason.loggedOut;

                    const restartRequired =
                        statusCode === DisconnectReason.restartRequired;

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

                    // restartRequired (515) is expected right after a pair
                    // code is verified — reconnect immediately, and don't
                    // let it eat into the retry budget for real failures.
                    if (restartRequired) {

                        console.log("🔄 Restart required — reconnecting immediately...");

                        connect();
                        return;
                    }

                    reconnectAttempts++;

                    if (reconnectAttempts > MAX_RECONNECT_ATTEMPTS) {

                        console.log(
                            `❌ Giving up after ${MAX_RECONNECT_ATTEMPTS} reconnect attempts (last code: ${statusCode}).`
                        );

                        finishCode(
                            new Error(
                                `Pairing failed after repeated disconnects (code ${statusCode}).`
                            )
                        );

                        jobManager.update(jobId, {
                            status: "failed"
                        });

                        try {
                            sock?.end();
                        } catch (_) {}

                        return;
                    }

                    const backoffMs =
                        Math.min(2000 * (2 ** (reconnectAttempts - 1)), 20000);

                    console.log(
                        `🔄 Restarting connection to complete pairing... (attempt ${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS}, waiting ${backoffMs}ms)`
                    );

                    setTimeout(connect, backoffMs);
                }
            });
        };

        connect();
    });
                            }

