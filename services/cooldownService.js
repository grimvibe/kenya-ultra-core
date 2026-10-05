import {
    loadCooldown,
    saveCooldown
} from "../auth/sessionStore.js";

// Sensible per-category default cooldowns (ms) for commands that
// don't declare their own `cooldown` property — these are the
// categories most likely to get hammered and are also the most
// expensive/risky to spam (external API calls, large media sends).
const CATEGORY_DEFAULTS = {
    Download: 15000,
    AI: 8000,
    Media: 10000
};

class CooldownService {

    /**
     * Returns { onCooldown: boolean, remainingMs: number } for a
     * given user + command, without setting anything — call
     * `start()` separately once the command actually runs.
     */
    async check(sessionId, userId, command) {

        const cooldownMs = this.resolve(command);

        if (!cooldownMs) {
            return { onCooldown: false, remainingMs: 0 };
        }

        const key = `${sessionId}:${userId}:${command.name}`;
        const lastRun = await loadCooldown(key);

        if (!lastRun) {
            return { onCooldown: false, remainingMs: 0 };
        }

        const elapsed = Date.now() - lastRun;
        const remaining = cooldownMs - elapsed;

        if (remaining > 0) {
            return { onCooldown: true, remainingMs: remaining };
        }

        return { onCooldown: false, remainingMs: 0 };

    }

    async start(sessionId, userId, command) {

        if (!this.resolve(command)) return;

        const key = `${sessionId}:${userId}:${command.name}`;
        await saveCooldown(key, Date.now());

    }

    resolve(command) {

        if (command.cooldown === 0) return 0; // explicit opt-out
        return command.cooldown || CATEGORY_DEFAULTS[command.category] || 0;

    }

}

export default new CooldownService();
