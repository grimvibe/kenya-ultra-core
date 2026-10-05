import Reply from "../../utils/reply.js";

export default {

    name: "gstatus",

    aliases: [
        "gcstatus",
        "groupstatus",
        "togstatus"
    ],

    description:
        "Post text, images, videos or audio to WhatsApp Group Status.",

    category: "Group",

    usage:
        ".gstatus <text> or reply to media with .gstatus",

    async execute(ctx) {

        const {
            isGroup,
            isAdmin,
            args,
            message
        } = ctx;

        // =====================================================
        // Group only
        // =====================================================

        if (!isGroup) {

            return Reply.error(
                "This command can only be used in groups."
            );

        }

        // =====================================================
        // Admin only
        // =====================================================

        if (!isAdmin) {

            return Reply.error(
                "Only group admins can use this command."
            );

        }

        const text =
            (args || [])
                .join(" ")
                .trim();

        // =====================================================
        // Get quoted message
        // =====================================================

        const quoted =
            message
                ?.extendedTextMessage
                ?.contextInfo
                ?.quotedMessage || null;

        // =====================================================
        // Quoted IMAGE
        // =====================================================

        if (quoted?.imageMessage) {

            return {

                success: true,

                action: "post_group_status",

                mediaType: "image",

                captionText: text

            };

        }

        // =====================================================
        // Quoted VIDEO
        // =====================================================

        if (quoted?.videoMessage) {

            return {

                success: true,

                action: "post_group_status",

                mediaType: "video",

                captionText: text

            };

        }

        // =====================================================
        // Quoted AUDIO
        // =====================================================

        if (quoted?.audioMessage) {

            return {

                success: true,

                action: "post_group_status",

                mediaType: "audio",

                captionText: text

            };

        }

        // =====================================================
        // Quoted TEXT
        // =====================================================

        const quotedText =
            quoted?.conversation ||
            quoted?.extendedTextMessage?.text ||
            null;

        if (quotedText) {

            return {

                success: true,

                action: "post_group_status",

                mediaType: "text",

                statusText: text
                    ? `${quotedText}\n\n${text}`
                    : quotedText

            };

        }

        // =====================================================
        // Normal typed TEXT
        // =====================================================

        if (text) {

            return {

                success: true,

                action: "post_group_status",

                mediaType: "text",

                statusText: text

            };

        }

        // =====================================================
        // Nothing supplied
        // =====================================================

        return Reply.error(
`❗ *Usage:*

.gstatus <text>

Or reply to:

🖼️ Image
🎥 Video
🎵 Audio
📝 Text

with:

.gstatus <optional caption>`
        );

    }

};
