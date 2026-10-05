import Reply from "../utils/reply.js";
import { getQuotedMessage } from "../utils/getMention.js";

export default {

    name: "take",

    aliases: ["steal"],

    description: "Save someone else's sticker under your own pack name.",

    category: "Media",

    usage: "Reply to a sticker with .take [pack name]",

    async execute(ctx) {

        const quoted = getQuotedMessage(ctx.message);

        if (!quoted?.stickerMessage) {

            return Reply.error(
"Reply to a sticker with .take to save it under your own pack name.\n\nExample:\n.take My Pack Name"
            );

        }

        const packname = ctx.args?.length
            ? ctx.args.join(" ")
            : "Kenya-Ultra";

        return {
            action: "take_sticker",
            packname,
            author: ctx.pushName || "Kenya-Ultra Bot"
        };

    }

};
