import axios from "axios";
import Reply from "../../utils/reply.js";

// Pinterest doesn't expose a public API for this, so this pulls the
// page HTML directly and reads the media URL out of the embedded
// JSON/meta tags. Works for pin.it short links (axios follows the
// redirect) and full pinterest.com/pin/... links.
async function extractMedia(url) {

    const { data: html } = await axios.get(url, {
        timeout: 15000,
        headers: {
            "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        }
    });

    // Video pins embed a direct .mp4 url somewhere in the page JSON.
    const videoMatch = html.match(
        /"url":"(https:\/\/v1\.pinimg\.com\/videos\/[^"]+\.mp4)"/
    );

    if (videoMatch) {
        return {
            type: "video",
            url: videoMatch[1].replace(/\\u002F/g, "/")
        };
    }

    // Fall back to the largest og:image (originals-quality photo pin).
    const imageMatch = html.match(
        /<meta property="og:image" content="([^"]+)"/
    );

    if (imageMatch) {
        return { type: "image", url: imageMatch[1] };
    }

    return null;

}

export default {

    name: "pinterest",

    aliases: ["pin"],

    description: "Download a Pinterest image or video pin.",

    category: "Download",

    usage: ".pinterest <pin link>",

    async execute(message) {

        const url = message.args[0];

        if (!url || !/pinterest\.|pin\.it/i.test(url)) {

            return Reply.error(
`Please provide a valid Pinterest link.

Example:
.pinterest https://pin.it/xxxxx`
            );

        }

        try {

            const media = await extractMedia(url);

            if (!media) {
                return Reply.error(
                    "Couldn't find any downloadable media on that pin."
                );
            }

            if (media.type === "video") {

                return Reply.video({
                    url: media.url,
                    caption: "🐺 Powered by Kenya-Ultra 👑"
                });

            }

            return Reply.image({
                url: media.url,
                caption: "🐺 Powered by Kenya-Ultra 👑"
            });

        } catch (err) {

            return Reply.error(
                err.message || "Failed to download that pin."
            );

        }

    }

};
