import { DisconnectReason } from "baileys";
import { createSocket } from "./baileys.js";
import { createSession } from "./sessionManager.js";
import { generateSessionId } from "../utils/idGenerator.js";
import { encodeSession } from "../utils/sessionEncoder.js";
import messageSender from "./messageSender.js";
import jobManager from "./jobManager.js";

export async function generatePair(phone, jobId) {
    const sessionId = generateSessionId();
    const sessionFolder = createSession(sessionId);

    return new Promise((resolve, reject) => {
        let codeSettled = false;
        let pairCode = null;
        let sock = null;

        // This only needs to cover "get the pairing code" now, not the
        // whole flow — the user still has up to 60s to actually type it
        // into WhatsApp, but that no longer blocks the HTTP response.
        const codeTimeout = setTimeout(() => {
            if (!codeSettled) {
                codeSettled = true;
                try { sock?.end(); } catch (_) {}
                jobManager.update(jobId, { status: "failed" });
                reject(new Error("Pairing request timed out."));
            }
        }, 60000);

        const finishCode = (err, result) => {
            if (codeSettled) return;
            codeSettled = true;
            clearTimeout(codeTimeout);
            if (err) {
                jobManager.update(jobId, { status: "failed" });
                reject(err);
            } else {
                resolve(result);
            }
        };

        const connect = async () => {
            sock = await createSocket(sessionFolder);

            if (!sock.authState?.creds?.registered && !pairCode) {
                (async () => {
                    try {
                        await new Promise((r) => setTimeout(r, 3000));
                        pairCode = await sock.requestPairingCode(phone);
                        console.log(`🔑 Pair code generated for ${phone}: ${pairCode}`);

                        // Resolve as soon as the code exists — the API layer
                        // returns this to the website right away instead of
                        // waiting for the full WhatsApp handshake to finish.
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

                    const sessionString = encodeSession(sock.authState.creds);

                    await messageSender.sendSessionId(sock, phone, sessionString);

                    jobManager.update(jobId, {
                        status: "connected",
                        sessionId: sessionString
                    });

                    console.log(`✅ SESSION_ID delivered to ${phone}`);

                    try {
                        sock.end();
                    } catch (_) {
                        // no-op — socket may already be closed
                    }
                }

                if (connection === "close") {
                    const statusCode = lastDisconnect?.error?.output?.statusCode;
                    const loggedOut = statusCode === DisconnectReason.loggedOut;

                    console.log("❌ Connection Closed", statusCode);

                    if (loggedOut) {
                        finishCode(new Error("Device was logged out during pairing."));
                        jobManager.update(jobId, { status: "failed" });
                        return;
                    }

                    if (!pairCode) {
                        // Closed before a code was ever issued — genuine failure.
                        finishCode(new Error("Connection Closed"));
                        return;
                    }

                    // A code was already issued — this is WhatsApp's expected
                    // "restart required" (515) close after successful pairing,
                    // OR a genuine drop after the code was issued but not yet
                    // used. Either way, reconnect with the same session folder.
                    console.log("🔄 Restarting connection to complete pairing...");
                    connect();
                }
            });
        };

        connect();
    });
                            }
