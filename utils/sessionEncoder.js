import zlib from "zlib";

// Bots elsewhere paste this string into SESSION_ID= in their .env,
// so it needs a recognizable prefix + to actually carry the creds.
const PREFIX = "KenyaUltra~";

export function encodeSession(creds) {
    const json = JSON.stringify(creds);
    const compressed = zlib.gzipSync(json);
    return PREFIX + compressed.toString("base64");
}

export function decodeSession(sessionString) {
    if (!sessionString || !sessionString.startsWith(PREFIX)) {
        throw new Error("Invalid SESSION_ID format.");
    }

    const b64 = sessionString.slice(PREFIX.length);
    const compressed = Buffer.from(b64, "base64");
    const json = zlib.gunzipSync(compressed).toString("utf-8");

    return JSON.parse(json);
}
