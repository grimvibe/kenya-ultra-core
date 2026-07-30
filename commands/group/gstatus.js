import Reply from "../../utils/reply.js";

function buildStatusText(body, postedBy, timestamp) {

    return (
`╭⊷ 📢 *GROUP STATUS*

│

├⊷ ${body}

│

├⊷ 👤 *Posted by:* ${postedBy}

├⊷ 🕒 *When:* ${timestamp}

│

╰⊷ 🐺 *Powered by Kenya-Ultra 👑*`
    );

}

export default {

    name: "gstatus",

    description: "Post a status/announcement in the group — type it directly, or reply to a text/photo message.",

    category: "Group",

    usage: ".gstatus <text>  (or reply to a text/photo with .gstatus [optional caption])",

    async execute(ctx) {

        const {

            isGroup,

            isAdmin,

            args,

            sender,

            pushName,

            message

        } = ctx;

        if (!isGroup)
            return Reply.error("This command can only be used in groups.");

        if (!isAdmin)
            return Reply.error("Only group admins can post a status.");

        const postedBy = pushName || (sender ? sender.split("@")[0] : "Admin");

        const timestamp = new Intl.DateTimeFormat("en-GB", {
            timeZone: "Africa/Nairobi",
            dateStyle: "medium",
            timeStyle: "short"
        }).format(new Date());

        const extraText = (args || []).join(" ").trim();

        const quoted =
            message?.extendedTextMessage?.contextInfo?.quotedMessage || null;

        // ── Case 1: admin replied to a photo ──────────────────
        if (quoted?.imageMessage) {

            return {

                success: true,

                action: "post_group_status",

                mediaType: "image",

                captionText: extraText,

                postedBy,

                timestamp,

                reply: Reply.info("Posting status...")

            };

        }

        // ── Case 2: admin replied to a text message ───────────
        const quotedText =
            quoted?.conversation ||
            quoted?.extendedTextMessage?.text ||
            null;

        if (quotedText) {

            const body = extraText
                ? `${quotedText}\n\n${extraText}`
                : quotedText;

            return Reply.text(
                buildStatusText(body, postedBy, timestamp),
                sender ? [sender] : []
            );

        }

        // ── Case 3: plain typed status ─────────────────────────
        if (extraText) {

            return Reply.text(
                buildStatusText(extraText, postedBy, timestamp),
                sender ? [sender] : []
            );

        }

        return Reply.error(
            "Provide the status text, or reply to a text/photo message with .gstatus.\nExample:\n.gstatus Meeting moved to 6PM today."
        );

    }

};
