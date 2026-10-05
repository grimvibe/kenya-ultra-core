import axios from "axios";

// =========================
// Primary AI provider
// =========================
// https://prexzyapis.com/ai/chateverywhere?text=...
//
// Example response:
// {
//   "status": true,
//   "statusCode": 200,
//   "creator": "prexzy",
//   "message": "...",
//   "userId": "...",
//   "temperature": 0.5
// }

const BASE = "https://prexzyapis.com";

async function ask(text) {

    try {

        const { data } = await axios.get(
            `${BASE}/ai/chateverywhere`,
            {
                params: { text },
                timeout: 30000
            }
        );

        if (!data.status || !data.message) {
            throw new Error(data.message || "Request failed.");
        }

        return data.message;

    } catch (err) {

        throw new Error(
            err.response?.data?.message ||
            err.message ||
            "Prexzy API request failed."
        );

    }

}

// =========================
// Chatbot auto-reply provider
// =========================
// https://prexzyapis.com/ai/aichat?prompt=...
//
// Example response:
// {
//   "status": true,
//   "statusCode": 200,
//   "creator": "prexzy",
//   "prompt": "Hey",
//   "response": "..."
// }

async function chat(prompt) {

    try {

        const { data } = await axios.get(
            `${BASE}/ai/aichat`,
            {
                params: { prompt },
                timeout: 30000
            }
        );

        if (!data.status || !data.response) {
            throw new Error(data.message || "Request failed.");
        }

        return data.response;

    } catch (err) {

        throw new Error(
            err.response?.data?.message ||
            err.message ||
            "Prexzy API request failed."
        );

    }

}

// =========================
// AskGPT5 provider
// =========================
// https://prexzyapis.com/ai/askgpt5?prompt=...
//
// Example response:
// {
//   "status": true,
//   "statusCode": 200,
//   "creator": "prexzy",
//   "prompt": "...",
//   "response": "...",
//   "chunks": [...],
//   "model": "...",
//   "service": "AskGPT5",
//   "state": "...",
//   "message": "Chat response generated successfully"
// }

async function askgpt5(prompt) {

    try {

        const { data } = await axios.get(
            `${BASE}/ai/askgpt5`,
            {
                params: { prompt },
                timeout: 30000
            }
        );

        if (!data.status || !data.response) {
            throw new Error(data.message || "Request failed.");
        }

        return data.response;

    } catch (err) {

        throw new Error(
            err.response?.data?.message ||
            err.message ||
            "Prexzy API request failed."
        );

    }

}

// =========================
// Trending movies/shows
// =========================
// https://prexzyapis.com/trending
//
// Example response:
// {
//   "status": true,
//   "statusCode": 200,
//   "creator": "prexzy",
//   "page": 1,
//   "tabId": "all",
//   "trending": {
//     "subjectList": [ { title, cover: { url }, genre, releaseDate, ... } ]
//   }
// }

async function trending() {

    try {

        const { data } = await axios.get(
            `${BASE}/trending`,
            { timeout: 30000 }
        );

        const list = data.trending?.subjectList;

        if (!data.status || !list) {
            throw new Error(data.message || "Request failed.");
        }

        return list;

    } catch (err) {

        throw new Error(
            err.response?.data?.message ||
            err.message ||
            "Prexzy API request failed."
        );

    }

}

// =========================
// Random quiz questions
// =========================
// https://prexzyapis.com/game/quizrandom
//
// Example response:
// {
//   "status": true,
//   "statusCode": 200,
//   "creator": "prexzy",
//   "mode": "random",
//   "level": "1",
//   "count": 10,
//   "message": "Questions generated successfully",
//   "data": [ { id, question, image, answer, timer, isMultiple } ]
// }

async function quizRandom() {

    try {

        const { data } = await axios.get(
            `${BASE}/game/quizrandom`,
            { timeout: 30000 }
        );

        if (!data.status || !data.data) {
            throw new Error(data.message || "Request failed.");
        }

        return data.data;

    } catch (err) {

        throw new Error(
            err.response?.data?.message ||
            err.message ||
            "Prexzy API request failed."
        );

    }

}

// =========================
// Apple Music search
// =========================
// https://prexzyapis.com/search/applemusic?q=...
//
// Example response:
// {
//   "status": true,
//   "statusCode": 200,
//   "creator": "prexzy",
//   "query": "...",
//   "region": "us",
//   "total": 6,
//   "data": [ { title, artist, link, image } ]
// }

async function appleMusicSearch(query) {

    try {

        const { data } = await axios.get(
            `${BASE}/search/applemusic`,
            {
                params: { q: query },
                timeout: 30000
            }
        );

        if (!data.status || !data.data) {
            throw new Error(data.message || "Request failed.");
        }

        return data.data;

    } catch (err) {

        throw new Error(
            err.response?.data?.message ||
            err.message ||
            "Prexzy API request failed."
        );

    }

}

// =========================
// Lyrics search
// =========================
// https://prexzyapis.com/search/lyrics?title=...
//
// Example response:
// {
//   "status": true,
//   "statusCode": 200,
//   "creator": "prexzy",
//   "data": { title, artist, album, duration, lyrics, syncedLyrics }
// }

async function lyricsSearch(title) {

    try {

        const { data } = await axios.get(
            `${BASE}/search/lyrics`,
            {
                params: { title },
                timeout: 30000
            }
        );

        if (!data.status || !data.data?.lyrics) {
            throw new Error(data.message || "No lyrics found.");
        }

        return data.data;

    } catch (err) {

        throw new Error(
            err.response?.data?.message ||
            err.message ||
            "Prexzy API request failed."
        );

    }

}

// =========================
// Website to ZIP downloader
// =========================
// https://prexzyapis.com/download/saveweb2zip?url=...
//
// Example response:
// {
//   "status": true,
//   "statusCode": 200,
//   "creator": "prexzy",
//   "data": { downloadUrl, copiedFilesAmount, originalUrl }
// }

async function web2zip(url) {

    try {

        const { data } = await axios.get(
            `${BASE}/download/saveweb2zip`,
            {
                params: { url },
                timeout: 60000
            }
        );

        if (!data.status || !data.data?.downloadUrl) {
            throw new Error(data.message || "Request failed.");
        }

        return data.data;

    } catch (err) {

        throw new Error(
            err.response?.data?.message ||
            err.message ||
            "Prexzy API request failed."
        );

    }

}

// =========================
// AIO (multi-platform) video downloader
// =========================
// https://prexzyapis.com/download/aio?url=...
//
// Example response:
// {
//   "status": true,
//   "statusCode": 200,
//   "creator": "prexzy",
//   "url": "...",
//   "platform": "Facebook",
//   "thumbnail": "...",
//   "quality": "HD",
//   "type": "Video",
//   "media": [ { url, thumbnail, quality, type } ],
//   "message": "Video downloaded successfully",
//   "service": "FastVidl"
// }

async function aioDownload(url) {

    try {

        const { data } = await axios.get(
            `${BASE}/download/aio`,
            {
                params: { url },
                timeout: 60000
            }
        );

        if (!data.status || !data.media?.length) {
            throw new Error(data.message || "Request failed.");
        }

        return data;

    } catch (err) {

        throw new Error(
            err.response?.data?.message ||
            err.message ||
            "Prexzy API request failed."
        );

    }

}

// =========================
// TikTok downloader (primary)
// =========================
// https://prexzyapis.com/download/tiktok?url=...
//
// Example response:
// {
//   "status": true,
//   "statusCode": 200,
//   "creator": "prexzy",
//   "data": {
//     "title": "...", "cover": "...", "duration": 15,
//     "play": "...",   // no watermark
//     "wmplay": "...", // watermarked
//     "hdplay": "...", // HD no watermark
//     "music": "...",
//     "author": { "unique_id": "...", "nickname": "..." },
//     "play_count": 0, "digg_count": 0, "comment_count": 0
//   }
// }

// =========================
// YouTube audio downloader
// =========================
// https://prexzyapis.com/download/ytmp3?url=...
//
// NOTE: base path is "/download/" — confirmed working
// 2026-08-09. ("/api/aio" 404s because that generic AIO route
// doesn't support YouTube at all; this dedicated route does.)
//
// Example response:
// {
//   "status": true, "statusCode": 200, "creator": "prexzy",
//   "type": "audio",
//   "info": { id, title, duration, duration_string, thumbnail,
//             uploader, channel, channel_url, webpage_url, ... },
//   "download_url": "...",   // best-quality pick, ready to use
//   "quality": "medium", "ext": "m4a", "abr": 129.5,
//   "filesize": 3449447,
//   "qualities": [ { format_id, quality, ext, abr, filesize,
//                     download_url }, ... ]   // all options
// }

async function ytmp3(url) {

    try {

        const { data } = await axios.get(
            `${BASE}/download/ytmp3`,
            {
                params: { url },
                timeout: 60000
            }
        );

        if (!data.status || !data.download_url) {
            throw new Error(data.message || "Request failed.");
        }

        return data;

    } catch (err) {

        throw new Error(
            err.response?.data?.message ||
            err.message ||
            "Prexzy API request failed."
        );

    }

}

async function tiktok(url) {

    try {

        const { data } = await axios.get(
            `${BASE}/download/tiktok`,
            {
                params: { url },
                timeout: 30000
            }
        );

        if (!data.status || !data.data?.play) {
            throw new Error(data.message || "Request failed.");
        }

        return data.data;

    } catch (err) {

        throw new Error(
            err.response?.data?.message ||
            err.message ||
            "Prexzy API request failed."
        );

    }

}

// =========================
// TikTok downloader (fallback)
// =========================
// https://prexzyapis.com/download/tik?url=...
//
// Example response:
// {
//   "status": true,
//   "statusCode": 200,
//   "creator": "prexzy",
//   "title": "Video TikTok",
//   "thumbnail": "...",
//   "video_downloads": [ { quality, text, url } ],
//   "audio_downloads": [ { text, url } ]
// }

async function tiktokAlt(url) {

    try {

        const { data } = await axios.get(
            `${BASE}/download/tik`,
            {
                params: { url },
                timeout: 30000
            }
        );

        if (!data.status || !data.video_downloads?.length) {
            throw new Error(data.message || "Request failed.");
        }

        return data;

    } catch (err) {

        throw new Error(
            err.response?.data?.message ||
            err.message ||
            "Prexzy API request failed."
        );

    }

}

// =========================
// Movie/TV info search (TMDB-style)
// =========================
// https://prexzyapis.com/anime/tmdb?action=search&query=...
//
// Example response:
// {
//   "status": true,
//   "statusCode": 200,
//   "creator": "prexzy",
//   "action": "search",
//   "result": {
//     "page": 1, "total_pages": 5, "total_results": 87,
//     "results": [
//       { id, title|name, media_type, overview, poster_path,
//         release_date|first_air_date, vote_average, genre_ids }
//     ]
//   }
// }
//
// NOTE: results can include media_type "movie", "tv", or "person".
// Callers should filter out "person" entries.

async function movieSearch(query) {

    try {

        const { data } = await axios.get(
            `${BASE}/anime/tmdb`,
            {
                params: { action: "search", query },
                timeout: 30000
            }
        );

        const list = data.result?.results;

        if (!data.status || !list) {
            throw new Error(data.message || "Request failed.");
        }

        return list.filter(item => item.media_type !== "person");

    } catch (err) {

        throw new Error(
            err.response?.data?.message ||
            err.message ||
            "Prexzy API request failed."
        );

    }

}

// =========================
// Streaming source search (movies/series with playable resources)
// =========================
// https://prexzyapis.com/search?q=...
//
// Example response:
// {
//   "status": true,
//   "statusCode": 200,
//   "creator": "prexzy",
//   "query": "...",
//   "results": {
//     "pager": { hasMore, nextPage, page, perPage, totalCount },
//     "items": [
//       { subjectId, subjectType, title, releaseDate, genre,
//         cover: { url }, countryName, imdbRatingValue,
//         subtitles, hasResource, detailPath }
//     ]
//   }
// }
//
// subjectId from an item here is what /detail?id= expects.

async function streamSearch(query) {

    try {

        const { data } = await axios.get(
            `${BASE}/search`,
            {
                params: { q: query },
                timeout: 30000
            }
        );

        const items = data.results?.items;

        if (!data.status || !items) {
            throw new Error(data.message || "Request failed.");
        }

        return items;

    } catch (err) {

        throw new Error(
            err.response?.data?.message ||
            err.message ||
            "Prexzy API request failed."
        );

    }

}

// =========================
// Streaming source detail (playback/episode data)
// =========================
// https://prexzyapis.com/detail?id=<subjectId>
//
// IMPORTANT: requires a real subjectId from streamSearch() — a plain
// title will fail with {"code":400,"reason":"PARAMS_ERROR"}.
//
// The exact shape of a *successful* response hasn't been confirmed yet
// (we've only seen the error case). This function returns the raw
// "detail" payload as-is so the caller can adapt once we see a real
// success example — do not assume a fixed schema here.

async function streamDetail(subjectId) {

    if (!subjectId) {
        throw new Error("subjectId is required.");
    }

    try {

        const { data } = await axios.get(
            `${BASE}/detail`,
            {
                params: { id: subjectId },
                timeout: 30000
            }
        );

        if (!data.status || data.detail?.code === 400) {
            throw new Error(
                data.detail?.message ||
                data.message ||
                "Failed to fetch detail for that title."
            );
        }

        return data.detail;

    } catch (err) {

        throw new Error(
            err.response?.data?.message ||
            err.message ||
            "Prexzy API request failed."
        );

    }

}

// =========================
// Pinterest downloader
// =========================
// https://prexzyapis.com/download/pinterest?url=...
//
// Response shape follows the same family as other /download/*
// endpoints on this API (status + data/media). Parsed defensively
// since Pinterest pins can be either an image or a video.

async function pinterestDownload(url) {

    try {

        const { data } = await axios.get(
            `${BASE}/download/pinterest`,
            {
                params: { url },
                timeout: 30000
            }
        );

        const item =
            data.data?.[0] ||
            data.result?.[0] ||
            data.media?.[0] ||
            data.data ||
            data.result;

        const mediaUrl =
            item?.url || item?.download_url || item?.video || item?.image;

        if (!data.status || !mediaUrl) {
            throw new Error(data.message || "Request failed.");
        }

        return {
            url: mediaUrl,
            isVideo:
                /\.(mp4|mov|webm)$/i.test(mediaUrl) ||
                item?.type === "video",
            title: item?.title || data.title || null
        };

    } catch (err) {

        throw new Error(
            err.response?.data?.message ||
            err.message ||
            "Prexzy API request failed."
        );

    }

}

// =========================
// Threads downloader
// =========================
// https://prexzyapis.com/download/threads?url=...

async function threadsDownload(url) {

    try {

        const { data } = await axios.get(
            `${BASE}/download/threads`,
            {
                params: { url },
                timeout: 30000
            }
        );

        const item =
            data.data?.[0] ||
            data.result?.[0] ||
            data.media?.[0] ||
            data.data ||
            data.result;

        const mediaUrl =
            item?.url || item?.download_url || item?.video || item?.image;

        if (!data.status || !mediaUrl) {
            throw new Error(data.message || "Request failed.");
        }

        return {
            url: mediaUrl,
            isVideo:
                /\.(mp4|mov|webm)$/i.test(mediaUrl) ||
                item?.type === "video",
            caption: item?.caption || data.caption || null
        };

    } catch (err) {

        throw new Error(
            err.response?.data?.message ||
            err.message ||
            "Prexzy API request failed."
        );

    }

}

// =========================
// Spotify downloader
// =========================
// https://prexzyapis.com/download/spotify?url=...

async function spotifyDownload(url) {

    try {

        const { data } = await axios.get(
            `${BASE}/download/spotify`,
            {
                params: { url },
                timeout: 40000
            }
        );

        const item = data.data || data.result || data;

        const audioUrl =
            item?.download_url || item?.audio || item?.url;

        if (!data.status || !audioUrl) {
            throw new Error(data.message || "Request failed.");
        }

        return {
            audio: audioUrl,
            title: item?.title || item?.name || "Spotify Track",
            artist: item?.artist || item?.artists || "Unknown Artist",
            cover: item?.cover || item?.image || item?.thumbnail || null
        };

    } catch (err) {

        throw new Error(
            err.response?.data?.message ||
            err.message ||
            "Prexzy API request failed."
        );

    }

}

// =========================
// GitHub repo search
// =========================
// https://prexzyapis.com/search/repos?q=...

async function githubRepoSearch(query) {

    try {

        const { data } = await axios.get(
            `${BASE}/search/repos`,
            {
                params: { q: query },
                timeout: 20000
            }
        );

        const items = data.items || data.result?.items || data.data;

        if (!data.status || !items?.length) {
            throw new Error(data.message || "No repositories found.");
        }

        return items[0];

    } catch (err) {

        throw new Error(
            err.response?.data?.message ||
            err.message ||
            "Prexzy API request failed."
        );

    }

}

// =========================
// GitHub user search
// =========================
// https://prexzyapis.com/search/users?q=...

async function githubUserSearch(query) {

    try {

        const { data } = await axios.get(
            `${BASE}/search/users`,
            {
                params: { q: query },
                timeout: 20000
            }
        );

        const items = data.items || data.result?.items || data.data;

        if (!data.status || !items?.length) {
            throw new Error(data.message || "No users found.");
        }

        return items[0];

    } catch (err) {

        throw new Error(
            err.response?.data?.message ||
            err.message ||
            "Prexzy API request failed."
        );

    }

}

// =========================
// Wallpaper search
// =========================
// https://prexzyapis.com/search/wallpaper?q=...

async function wallpaperSearch(query) {

    try {

        const { data } = await axios.get(
            `${BASE}/search/wallpaper`,
            {
                params: { q: query },
                timeout: 20000
            }
        );

        const items = data.result || data.data || data.items;

        if (!data.status || !items?.length) {
            throw new Error(data.message || "No wallpapers found.");
        }

        return items;

    } catch (err) {

        throw new Error(
            err.response?.data?.message ||
            err.message ||
            "Prexzy API request failed."
        );

    }

}

// =========================
// DeepQuery provider (fallback)
// =========================
// https://prexzyapis.com/ai/deepquery?prompt=...
//
// Example response:
// {
//   "status": true,
//   "statusCode": 200,
//   "creator": "prexzy",
//   "prompt": "Hi",
//   "response": "...",
//   "file": null,
//   "model": "Meta LLaMA 4 Scout 17B",
//   "service": "DeepQuery"
// }

async function deepQuery(prompt) {

    try {

        const { data } = await axios.get(
            `${BASE}/ai/deepquery`,
            {
                params: { prompt },
                timeout: 30000
            }
        );

        if (!data.status || !data.response) {
            throw new Error(data.message || "Request failed.");
        }

        return data.response;

    } catch (err) {

        throw new Error(
            err.response?.data?.message ||
            err.message ||
            "Prexzy API request failed."
        );

    }

}

export default {
    ask,
    chat,
    deepQuery,
    askgpt5,
    ytmp3,
    trending,
    quizRandom,
    appleMusicSearch,
    lyricsSearch,
    web2zip,
    aioDownload,
    tiktok,
    tiktokAlt,
    movieSearch,
    streamSearch,
    streamDetail,
    pinterestDownload,
    threadsDownload,
    spotifyDownload,
    githubRepoSearch,
    githubUserSearch,
    wallpaperSearch
};
