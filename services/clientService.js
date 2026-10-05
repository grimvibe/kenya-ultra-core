import runtimeManager from "../runtime/runtimeManager.js";
import chalk from "chalk";

class ClientService {

    // No real socket to store — Core (Cloud Run) and the public bot
    // client (Pterodactyl) are entirely separate processes/services,
    // so there was never anything live to hold onto here even before
    // this rewrite; the old connect(sessionId, socket) signature was
    // vestigial from an earlier single-process architecture and
    // nothing ever actually called it. This just records that a
    // session is alive, refreshed on every call — see api/connect.js
    // — so repeated calls double as a heartbeat, not just a one-time
    // registration.
    connect(sessionId) {

        if (!sessionId) {
            throw new Error("SESSION_ID is required.");
        }

        const alreadyKnown = Boolean(runtimeManager.get(sessionId));

        runtimeManager.add(sessionId);

        if (alreadyKnown) {

            return {
                success: true,
                message: "Heartbeat received."
            };

        }

        console.log(
            chalk.green(`✓ Client Connected -> ${sessionId}`)
        );

        return {
            success: true,
            sessionId,
            message: "Client connected successfully."
        };

    }

    disconnect(sessionId) {

        runtimeManager.remove(sessionId);

        console.log(
            chalk.red(`✗ Client Disconnected -> ${sessionId}`)
        );

        return {
            success: true
        };

    }

    isConnected(sessionId) {
        return Boolean(runtimeManager.get(sessionId));
    }

    total() {
        return runtimeManager.total();
    }

    onlineClients() {
        return runtimeManager.list();
    }

}

export default new ClientService();
