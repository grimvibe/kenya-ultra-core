import {
    saveWarn,
    loadWarn,
    deleteWarn
} from "../auth/sessionStore.js";

class WarnService {

    async add(groupId, userId, reason = "No reason") {

        const data = await loadWarn(groupId, userId);

        data.count++;

        data.reasons.push({
            reason,
            date: Date.now()
        });

        await saveWarn(groupId, userId, data);

        return data;

    }

    async get(groupId, userId) {

        return await loadWarn(groupId, userId);

    }

    async remove(groupId, userId) {

        const data = await loadWarn(groupId, userId);

        if (data.count > 0) {

            data.count--;

            data.reasons.pop();

        }

        await saveWarn(groupId, userId, data);

        return data;

    }

    async reset(groupId, userId) {

        await deleteWarn(groupId, userId);

    }

}

export default new WarnService();
