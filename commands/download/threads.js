import axios from "axios";
import Reply from "../../utils/reply.js";

async function extractMedia(url) {

    const { data: html } = await axios.get(url, {
        timeout: 15000,
        headers: {
            "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        }
    });

    const videoMatch = html.match(
        /<meta property="og:video" content="([^"]+)"/
    );

    if (videoMatch) {
        return { type: "video", url: videoMatch[1] };
    }

    const imageMatch = html.match(
        /<meta property="og:image" content="([^"]+)"/
    );

    if (imageMatch) {
        return { type: "image", url: imageMatch[1] };
    }

    return null;

}

export default {

    name: "threads",

    description: "Download a photo or video from a Threads post.",

    category: "Download",

    usage: ".threads <post link>",

    async execute(message) {

        const url = message.args[0];

        if (!url || !/threads\.(net|com)/i.test(url)) {

            return Reply.error(
`Please provide a valid Threads link.

Example:
.threads https://www.threads.net/@user/post/xxxxx`
            );

        }

        try {

            const media = await extractMedia(url);

            if (!media) {
                return Reply.error(
                    "Couldn't find any downloadable media on that post."
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
                err.message || "Failed to download that Threads post."
            );

        }

    }

};
