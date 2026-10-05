import chalk from "chalk";

// A session counts as "connected" only if it's been pinged (via
// clientService.connect) within this window. The bot pings once on
// WhatsApp connect and then periodically as a heartbeat, so a session
// that crashed or got force-killed without a clean disconnect signal
// — the common case; Pterodactyl restarts, OOM kills, network drops,
// etc. don't give a process the chance to call /disconnect — naturally
// ages out of the "connected" count instead of sitting there forever.
const STALE_AFTER_MS = 5 * 60 * 1000; // 5 minutes

class RuntimeManager {

    constructor() {
        this.clients = new Map();
    }

    add(sessionId, meta = {}) {

        const existing = this.clients.get(sessionId);

        this.clients.set(sessionId, {
            connectedAt: existing?.connectedAt || Date.now(),
            lastSeenAt: Date.now(),
            ...meta
        });

        if (!existing) {

            console.log(
                chalk.green(`✓ Runtime Started -> ${sessionId}`)
            );

        }

    }

    get(sessionId) {

        const entry = this.clients.get(sessionId);

        if (entry && Date.now() - entry.lastSeenAt > STALE_AFTER_MS) {
            return undefined;
        }

        return entry;

    }

    remove(sessionId) {

        if (this.clients.has(sessionId)) {

            this.clients.delete(sessionId);

            console.log(
                chalk.red(`✗ Runtime Stopped -> ${sessionId}`)
            );

        }

    }

    // Drop anything that's aged out before reporting counts/lists —
    // avoids needing a background timer while keeping total()/list()
    // accurate against sessions that vanished without a goodbye.
    _pruneStale() {

        const now = Date.now();

        for (const [sessionId, entry] of this.clients) {

            if (now - entry.lastSeenAt > STALE_AFTER_MS) {
                this.clients.delete(sessionId);
            }

        }

    }

    total() {
        this._pruneStale();
        return this.clients.size;
    }

    list() {
        this._pruneStale();
        return [...this.clients.keys()];
    }

}

export default new RuntimeManager();
