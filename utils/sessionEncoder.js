import zlib from "zlib";

const PREFIX = "KenyaUltra~";

/**
 * Encode the entire Baileys auth state
 * (creds + keys)
 */
export function encodeSession(authState) {

    if (!authState) {
        throw new Error("Auth state is required.");
    }

    const json = JSON.stringify(authState);

    const compressed = zlib.gzipSync(json);

    return PREFIX + compressed.toString("base64");

}

/**
 * Decode SESSION_ID back into the full auth state
 */
export function decodeSession(sessionString) {

    if (!sessionString) {
        throw new Error("SESSION_ID is missing.");
    }

    if (!sessionString.startsWith(PREFIX)) {
        throw new Error("Invalid SESSION_ID format.");
    }

    const base64 = sessionString.slice(PREFIX.length);

    const compressed = Buffer.from(base64, "base64");

    const json = zlib.gunzipSync(compressed).toString("utf8");

    const authState = JSON.parse(json);

    if (!authState.creds) {
        throw new Error("Invalid auth credentials.");
    }

    return authState;

}
