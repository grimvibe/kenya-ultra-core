import axios from "axios";

const REST_URL = process.env.UPSTASH_REDIS_REST_URL;
const REST_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

if (!REST_URL || !REST_TOKEN) {
    throw new Error(
        "UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN must be set. " +
        "Sign up free at https://upstash.com, create a Redis database, " +
        "and copy the REST URL + token into Core's environment variables."
    );
}

const client = axios.create({
    baseURL: REST_URL,
    headers: {
        Authorization: `Bearer ${REST_TOKEN}`
    },
    // axios uses Node's classic http/https modules by default, not
    // undici's fetch — this sidesteps the "HTTP/2 frameError" issue
    // some hosts/networks trigger with Node's native fetch().
    timeout: 10000
});

async function redisRequest(command) {

    try {

        const path = "/" + command.map(encodeURIComponent).join("/");

        const { data } = await client.get(path);

        if (data.error) {
            throw new Error(`Redis error: ${data.error}`);
        }

        return data.result;

    } catch (error) {

        if (error.response) {
            throw new Error(
                `Redis request failed: ${error.response.status} ${JSON.stringify(error.response.data)}`
            );
        }

        throw error;

    }

}

/**
 * Store the full auth snapshot ({ creds, keys }) under a short
 * session ID. No expiry — sessions live until the user re-pairs.
 */
export async function saveAuth(sessionId, snapshot) {
    await redisRequest([
        "set",
        `session:${sessionId}`,
        JSON.stringify(snapshot)
    ]);
}

/**
 * Fetch the full auth snapshot for a short session ID.
 * Returns null if the session doesn't exist.
 */
export async function loadAuth(sessionId) {

    const raw = await redisRequest([
        "get",
        `session:${sessionId}`
    ]);

    if (!raw) {
        return null;
    }

    return JSON.parse(raw);

}

export async function deleteAuth(sessionId) {
    await redisRequest([
        "del",
        `session:${sessionId}`
    ]);
}
