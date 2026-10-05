// utils/vreden.js
// Wrapper around @vreden/youtube_scraper — same IP-lock problem as
// BK9 (its download link is signed/bound and won't work when handed
// straight to the public bot on a different server), so this rehosts
// through Core the same way utils/bk9.js does, via BK9.rehost().

import { ytmp3 as vreden_ytmp3, ytmp4 as vreden_ytmp4 } from "@vreden/youtube_scraper";
import BK9 from "./bk9.js";

async function ytmp3(url) {

    if (!url) throw new Error("URL is required.");

    const result = await vreden_ytmp3(url);

    if (!result?.status || !result.download?.url) {
        throw new Error(result?.result || "Vreden ytmp3 failed.");
    }

    const meta = result.metadata || {};
    const dl = result.download;

    const hostedUrl = await BK9.rehost(dl.url, dl.format || "mp3");

    return {
        downloadUrl: hostedUrl,
        title: meta.title,
        thumbnail: meta.thumbnail || meta.image,
        duration: meta.duration?.timestamp || meta.timestamp,
        size: dl.filesize || dl.size
    };

}

async function ytmp4(url, quality) {

    if (!url) throw new Error("URL is required.");

    const result = await vreden_ytmp4(url, quality);

    if (!result?.status || !result.download?.url) {
        throw new Error(result?.result || "Vreden ytmp4 failed.");
    }

    const meta = result.metadata || {};
    const dl = result.download;

    const hostedUrl = await BK9.rehost(dl.url, "mp4");

    return {
        downloadUrl: hostedUrl,
        title: meta.title,
        thumbnail: meta.thumbnail || meta.image,
        duration: meta.duration?.timestamp || meta.timestamp,
        size: dl.filesize || dl.size
    };

}

export default { ytmp3, ytmp4 };
