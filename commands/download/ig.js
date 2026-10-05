import Reply from "../../utils/reply.js";
import { isInstagramUrl, fetchInstagramMedia } from "../../utils/instagram.js";

export default {

    name: "ig",

    aliases: ["instagram", "igdl"],

    description: "Download Instagram photos/videos/reels from a link.",

    category: "Download",

    usage: ".ig <instagram link>",

    async execute(ctx) {

        const url = ctx.args[0];

        if (!url)
            return Reply.error(
"Please provide an Instagram link.\n\nExample:\n.ig https://www.instagram.com/reel/xxxxx/"
            );

        if (!isInstagramUrl(url))
            return Reply.error(
"That's not a valid Instagram link. Please provide a valid Instagram post, reel, or video link."
            );

        try {

            const items = await fetchInstagramMedia(url);

            return {

                action: "send_media_batch",

                items,

                reactEmoji: "🔄",

                caption: "𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗𝗘𝗗 𝗕𝗬 🐺 Kenya-Ultra"

            };

        } catch (err) {

            return Reply.error(
                err.message || "An error occurred while processing the Instagram request. Please try again."
            );

        }

    }

};
