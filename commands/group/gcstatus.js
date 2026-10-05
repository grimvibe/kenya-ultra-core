import Reply from "../../utils/reply.js";
import { getQuotedMessage } from "../../utils/getMention.js";

export default {

    name: "gcstatus",

    aliases: ["groupstatus", "togstatus"],

    description:
"Post text, or a replied image/video/audio, to WhatsApp Status — tagged so it's visible to everyone in this group.",

    category: "Group",

    usage:
".gcstatus <text>\nOr reply to an image/video/audio with .gcstatus <optional caption>",

    async execute(ctx) {

        if (!ctx.isBotOwner) {
            return Reply.error("Only the bot owner can use this command.");
        }

        if (!ctx.isGroup) {
            return Reply.error("This command is restricted to groups only.");
        }

        if (!ctx.isAdmin) {
            return Reply.error("You must be admin to use this command.");
        }

        const quoted = getQuotedMessage(ctx.message);

        const hasQuotedMedia = Boolean(
            quoted?.imageMessage ||
            quoted?.videoMessage ||
            quoted?.audioMessage
        );

        const caption = ctx.args?.length ? ctx.args.join(" ") : "";

        if (!hasQuotedMedia && !caption) {

            return Reply.error(
`❗ *Usage:*
.gcstatus <text>
Or reply to an image/video/audio with .gcstatus <optional caption>

*Example:* .gcstatus Hello everyone!`
            );

        }

        // Actual status post needs the real media bytes plus the raw
        // socket's status@broadcast/statusJidList options, which only
        // the gateway (index.js) has access to — this just tells it
        // to go do it.
        return {
            action: "post_group_status",
            caption
        };

    }

};
