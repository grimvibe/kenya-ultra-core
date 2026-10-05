import { igdl } from "ruhend-scraper";

const INSTAGRAM_PATTERNS = [
    /https?:\/\/(?:www\.)?instagram\.com\//,
    /https?:\/\/(?:www\.)?instagr\.am\//
];

export function isInstagramUrl(text) {

    return INSTAGRAM_PATTERNS.some(pattern => pattern.test(text));

}

function isVideoMedia(media, sourceUrl) {

    return (
        /\.(mp4|mov|avi|mkv|webm)$/i.test(media.url || "") ||
        media.type === "video" ||
        sourceUrl.includes("/reel/") ||
        sourceUrl.includes("/tv/")
    );

}

// Dedupes by exact URL, matching the reference implementation.
function extractUniqueMedia(mediaData) {

    const uniqueMedia = [];
    const seenUrls = new Set();

    for (const media of mediaData) {

        if (!media.url) continue;

        if (!seenUrls.has(media.url)) {
            seenUrls.add(media.url);
            uniqueMedia.push(media);
        }

    }

    return uniqueMedia;

}

export async function fetchInstagramMedia(url) {

    const downloadData = await igdl(url);

    if (!downloadData?.data?.length) {
        throw new Error("No media found at the provided link. The post might be private or the link is invalid.");
    }

    const uniqueMedia = extractUniqueMedia(downloadData.data);

    // Cap at 20 items, matching the reference implementation.
    const items = uniqueMedia.slice(0, 20).map(media => ({
        url: media.url,
        type: isVideoMedia(media, url) ? "video" : "image"
    }));

    if (!items.length) {
        throw new Error("No valid media found to download. This might be a private post or the scraper failed.");
    }

    return items;

}
