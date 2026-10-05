import axios from "axios";

const BASE = "https://davexmovieapi.zone.id";

// =========================
// Full detail (metadata + all resolution links)
// =========================
// GET /movie/info/<subjectId>
//
// This is the PRIMARY source for playback/download links — confirmed
// working. Response includes resource_detectors[].resolution_list[]
// with a resource_link/download_url per resolution (360/480/720/1080).
//
// subjectId comes from Prexzy's /search?q= results (same aoneroom-style
// numeric id scheme — confirmed cross-compatible).

async function movieInfo(subjectId) {

    if (!subjectId) {
        throw new Error("subjectId is required.");
    }

    try {

        const { data } = await axios.get(
            `${BASE}/movie/info/${subjectId}`,
            { timeout: 30000 }
        );

        if (!data || data.has_resource === false && !data.resource_detectors) {
            throw new Error("No resource data available for this title.");
        }

        return data;

    } catch (err) {

        throw new Error(
            err.response?.data?.message ||
            err.message ||
            "Davex API request failed."
        );

    }

}

// =========================
// Direct single-resolution stream link
// =========================
// GET /movie/stream/<subjectId>?resolution=360|480|720|1080
//
// Lighter/faster than movieInfo() when you already know which
// resolution you want — returns just that file's playable link.

async function movieStream(subjectId, resolution = 480) {

    if (!subjectId) {
        throw new Error("subjectId is required.");
    }

    try {

        const { data } = await axios.get(
            `${BASE}/movie/stream/${subjectId}`,
            {
                params: { resolution },
                timeout: 30000
            }
        );

        if (!data?.url) {
            throw new Error(
                `No ${resolution}P link available for this title.`
            );
        }

        return data;

    } catch (err) {

        throw new Error(
            err.response?.data?.message ||
            err.message ||
            "Davex API request failed."
        );

    }

}

// =========================
// Browse: popular
// =========================
// GET /movie/popular?page=

async function popular(page = 1) {

    try {

        const { data } = await axios.get(
            `${BASE}/movie/popular`,
            {
                params: { page },
                timeout: 30000
            }
        );

        return data.results || [];

    } catch (err) {

        throw new Error(
            err.response?.data?.message ||
            err.message ||
            "Davex API request failed."
        );

    }

}

// =========================
// Browse: newest releases
// =========================
// GET /movie/new?page=&per_page=

async function newest(page = 1, perPage = 20) {

    try {

        const { data } = await axios.get(
            `${BASE}/movie/new`,
            {
                params: { page, per_page: perPage },
                timeout: 30000
            }
        );

        return data.results || [];

    } catch (err) {

        throw new Error(
            err.response?.data?.message ||
            err.message ||
            "Davex API request failed."
        );

    }

}

// =========================
// Browse: by genre
// =========================
// GET /movie/genre?genre=&page=&per_page=

async function byGenre(genre, page = 1, perPage = 20) {

    if (!genre) {
        throw new Error("genre is required.");
    }

    try {

        const { data } = await axios.get(
            `${BASE}/movie/genre`,
            {
                params: { genre, page, per_page: perPage },
                timeout: 30000
            }
        );

        return data.results || [];

    } catch (err) {

        throw new Error(
            err.response?.data?.message ||
            err.message ||
            "Davex API request failed."
        );

    }

}

export default {
    movieInfo,
    movieStream,
    popular,
    newest,
    byGenre
};
