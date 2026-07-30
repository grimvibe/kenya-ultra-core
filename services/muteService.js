import {
    saveMuteList,
    loadMuteList,
    deleteMuteList
} from "../auth/sessionStore.js";

class MuteService {

    // Removes any expired entries from a mute map and reports
    // whether the map changed (so callers can decide to persist it).
    _prune(data) {

        const now = Date.now();
        let changed = false;

        for (const userId of Object.keys(data)) {

            const entry = data[userId];

            if (entry.until && entry.until <= now) {
                delete data[userId];
                changed = true;
            }

        }

        return changed;

    }

    async mute(groupId, userId, durationMs = null) {

        const data = await loadMuteList(groupId);

        this._prune(data);

        data[userId] = {
            mutedAt: Date.now(),
            until: durationMs ? Date.now() + durationMs : null
        };

        await saveMuteList(groupId, data);

        return data[userId];

    }

    async muteMany(groupId, userIds, durationMs = null) {

        const data = await loadMuteList(groupId);

        this._prune(data);

        const until = durationMs ? Date.now() + durationMs : null;

        for (const userId of userIds) {

            data[userId] = {
                mutedAt: Date.now(),
                until
            };

        }

        await saveMuteList(groupId, data);

        return data;

    }

    async unmute(groupId, userId) {

        const data = await loadMuteList(groupId);

        const existed = Boolean(data[userId]);

        delete data[userId];

        await saveMuteList(groupId, data);

        return existed;

    }

    async unmuteAll(groupId) {

        await deleteMuteList(groupId);

    }

    async isMuted(groupId, userId) {

        const data = await loadMuteList(groupId);

        const changed = this._prune(data);

        if (changed) {
            await saveMuteList(groupId, data);
        }

        return Boolean(data[userId]);

    }

    async list(groupId) {

        const data = await loadMuteList(groupId);

        const changed = this._prune(data);

        if (changed) {
            await saveMuteList(groupId, data);
        }

        return data;

    }

}

export default new MuteService();
