import runtimeManager from "../runtime/runtimeManager.js";
import chalk from "chalk";

class ClientService {

    async connect(sessionId, socket) {

        if (!sessionId) {
            throw new Error("SESSION_ID is required.");
        }

        const existing = runtimeManager.get(sessionId);

        if (existing) {

            console.log(
                chalk.yellow(`⚠ ${sessionId} is already connected.`)
            );

            return {
                success: true,
                message: "Already connected."
            };

        }

        runtimeManager.add(sessionId, socket);

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

    get(sessionId) {
        return runtimeManager.get(sessionId);
    }

    total() {
        return runtimeManager.total();
    }

    onlineClients() {
        return runtimeManager.list();
    }

}

export default new ClientService();
