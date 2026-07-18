import redis from "../database/redis.js";

function key(groupId, userId) {
    return `warn:${groupId}:${userId}`;
}

class WarnService {

    async add(groupId, userId, reason = "No reason") {

        const data = await this.get(groupId, userId);

        data.count++;

        data.reasons.push({
            reason,
            date: Date.now()
        });

        await redis.set(
            key(groupId, userId),
            JSON.stringify(data)
        );

        return data;

    }

    async get(groupId, userId) {

        const raw = await redis.get(
            key(groupId, userId)
        );

        if (!raw) {

            return {
                count: 0,
                reasons: []
            };

        }

        return JSON.parse(raw);

    }

    async remove(groupId, userId) {

        const data = await this.get(groupId, userId);

        if (data.count > 0) {

            data.count--;

            data.reasons.pop();

        }

        await redis.set(
            key(groupId, userId),
            JSON.stringify(data)
        );

        return data;

    }

    async reset(groupId, userId) {

        await redis.del(
            key(groupId, userId)
        );

    }

}

export default new WarnService();
