import axios from "axios";

// Same Upstash REST pattern as auth/sessionStore.js. A separate,
// tiny client here rather than importing from sessionStore.js since
// that module only exports session/settings-shaped functions, not
// the raw request helper.

const REST_URL = process.env.UPSTASH_REDIS_REST_URL;
const REST_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

const client = axios.create({
    baseURL: REST_URL,
    headers: {
        Authorization: `Bearer ${REST_TOKEN}`
    },
    timeout: 10000
});

async function redisRequest(command) {

    const path = "/" + command.map(encodeURIComponent).join("/");

    const { data } = await client.get(path);

    if (data.error) {
        throw new Error(data.error);
    }

    return data.result;

}

// How long a "reply with a number" search stays valid.
const TTL_MS = 2 * 60 * 1000;

function keyFor(chat, sender) {
    return `spotifysearch:${chat}:${sender}`;
}

export async function savePendingSearch(chat, sender, senderAlt, tracks) {

    const payload = {
        tracks,
        expiresAt: Date.now() + TTL_MS
    };

    const serialized = JSON.stringify(payload);

    const identities = [sender, senderAlt].filter(Boolean);

    // Written under every identity we know for this person (their
    // phone-JID and/or @lid) so the follow-up "1"-"5" reply resolves
    // no matter which form WhatsApp happens to route it as — the same
    // ambiguity already handled for isOwner() and the chatbot trigger.
    await Promise.all(
        identities.map(id =>
            redisRequest([
                "set",
                keyFor(chat, id),
                serialized
            ])
        )
    );

}

// Reads AND clears the pending search in one call (a number reply is
// always a one-shot pick — we don't want a stale list answerable
// twice, and we don't want it to survive past its TTL). Checks every
// identity we have for this person and cleans up all of them once
// found, so a stale copy under the other identity can't get reused
// by an unrelated later "1"-"5" message.
export async function takePendingSearch(chat, sender, senderAlt) {

    const identities = [sender, senderAlt].filter(Boolean);

    for (const id of identities) {

        const key = keyFor(chat, id);

        const raw = await redisRequest(["get", key]);

        if (!raw) continue;

        // Clean up every identity's key, not just the one that hit.
        await Promise.all(
            identities.map(otherId =>
                redisRequest(["del", keyFor(chat, otherId)]).catch(() => {})
            )
        );

        const payload = JSON.parse(raw);

        if (Date.now() > payload.expiresAt) {
            return null;
        }

        return payload.tracks;

    }

    return null;

}
