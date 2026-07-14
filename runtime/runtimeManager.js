import chalk from "chalk";

class RuntimeManager {

    constructor() {
        this.clients = new Map();
    }

    add(sessionId, socket) {

        this.clients.set(sessionId, socket);

        console.log(
            chalk.green(`✓ Runtime Started -> ${sessionId}`)
        );

    }

    get(sessionId) {
        return this.clients.get(sessionId);
    }

    remove(sessionId) {

        if (this.clients.has(sessionId)) {

            this.clients.delete(sessionId);

            console.log(
                chalk.red(`✗ Runtime Stopped -> ${sessionId}`)
            );

        }

    }

    total() {
        return this.clients.size;
    }

    list() {
        return [...this.clients.keys()];
    }

}

export default new RuntimeManager();
