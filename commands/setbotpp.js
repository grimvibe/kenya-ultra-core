import Reply from "../utils/reply.js";
import { getQuotedMessage } from "../utils/getMention.js";

export default {

    name: "setbotpp",

    description: "Set the bot's own WhatsApp profile picture. Reply to an image, or send one directly with this as the caption.",

    category: "Owner",

    usage: "Reply to an image with .setbotpp",

    async execute(ctx) {

        if (!ctx.isBotOwner) {
            return Reply.error("Only the bot owner can use this command.");
        }

        const quoted = getQuotedMessage(ctx.message);

        const hasDirectImage = Boolean(ctx.message?.imageMessage);
        const hasQuotedImage = Boolean(quoted?.imageMessage);

        if (!hasDirectImage && !hasQuotedImage) {

            return Reply.error(
`Reply to an image with .setbotpp, or send the image directly with .setbotpp as the caption.`
            );

        }

        return { action: "set_bot_photo" };

    }

};
