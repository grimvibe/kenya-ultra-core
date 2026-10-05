// Shared helper for every Nexoracle-backed command (image-creating,
// ephoto360, textpro, etc). Nexoracle's own endpoints just take a
// GET request and either return the image directly (binary) or a
// JSON wrapper with a result field, depending on the category — so
// this only builds the URL; each command decides how to use it.

const BASE = "https://api.nexoracle.com";

const API_KEY =
    process.env.NEXORACLE_API_KEY ||
    "a89f1013d6c1153873";

export function buildUrl(path, params = {}) {

    const query = new URLSearchParams({
        apikey: API_KEY,
        ...params
    }).toString();

    return `${BASE}${path}?${query}`;

}

export default { buildUrl, API_KEY, BASE };
