import Reply from "../utils/reply.js";
import { getQuotedMessage } from "../utils/getMention.js";

export default {

    name: "sticker",

    aliases: ["s"],

    description: "Convert a photo, short video, or GIF into a sticker.",

    category: "Media",

    usage:
"Reply to an image/video/gif with .sticker (or .s), or send the media directly with .sticker as the caption.",

    async execute(ctx) {

        const quoted = getQuotedMessage(ctx.message);

        const hasDirectMedia = Boolean(
            ctx.message?.imageMessage || ctx.message?.videoMessage
        );

        const hasQuotedMedia = Boolean(
            quoted?.imageMessage || quoted?.videoMessage
        );

        if (!hasDirectMedia && !hasQuotedMedia) {

            return Reply.error(
`Reply to an image, video, or GIF with .sticker (or .s).

You can also send the media directly with ".sticker" as the caption.`
            );

        }

        // Actual conversion needs the real media bytes, which only
        // the gateway has access to — this just tells it to go do it.
        return {
            action: "make_sticker",
            packname: "Kenya-Ultra",
            author: ctx.pushName || "Kenya-Ultra Bot"
        };

    }

};
