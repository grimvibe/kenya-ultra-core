import { randomUUID } from "crypto";

import { createSession } from "./sessionManager.js";
import { createSocket } from "./baileys.js";

export async function generatePair(phone) {

    const sessionId = randomUUID();

    const folder = createSession(sessionId);

    const sock = await createSocket(folder);

    const code = await sock.requestPairingCode(phone);

    return {
        success: true,
        sessionId,
        pairCode: code
    };

}
