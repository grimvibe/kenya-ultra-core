class Reply {

    // ==========================
    // TEXT
    // ==========================

    static text(text, mentions = []) {

        return {
            success: true,
            reply: {
                type: "text",
                text,
                mentions
            }
        };

    }

    static success(text) {

        return {
            success: true,
            reply: {
                type: "text",
                text: `✅ ${text}`
            }
        };

    }

    static error(text) {

        return {
            success: false,
            reply: {
                type: "text",
                text: `❌ ${text}`
            }
        };

    }

    static info(text) {

        return {
            success: true,
            reply: {
                type: "text",
                text: `ℹ️ ${text}`
            }
        };

    }

    // ==========================
    // IMAGE
    // ==========================

    static image({

        url,

        file,

        caption = "",

        contact = null,

        mentions = []

    }) {

        return {

            success: true,

            reply: {

                type: "image",

                url,

                file,

                caption,

                contact,

                mentions

            }

        };

    }

    // ==========================
    // AUDIO
    // ==========================

    static audio({

        url,

        mimetype = "audio/mp4",

        fileName = "audio.mp3",

        caption = ""

    }) {

        return {

            success: true,

            reply: {

                type: "audio",

                url,

                mimetype,

                fileName,

                caption

            }

        };

    }

    // ==========================
    // VIDEO
    // ==========================

    static video({

        url,

        mimetype = "video/mp4",

        fileName = "video.mp4",

        caption = ""

    }) {

        return {

            success: true,

            reply: {

                type: "video",

                url,

                mimetype,

                fileName,

                caption

            }

        };

    }

    // ==========================
    // STICKER
    // ==========================

    static sticker({

        url

    }) {

        return {

            success: true,

            reply: {

                type: "sticker",

                url

            }

        };

    }

    // ==========================
    // DOCUMENT
    // ==========================

    static document({

        url,

        fileName,

        mimetype

    }) {

        return {

            success: true,

            reply: {

                type: "document",

                url,

                fileName,

                mimetype

            }

        };

    }

    // ==========================
    // DOWNLOAD CARD
    // ==========================

    static download({

        mediaType,

        url,

        title,

        thumbnail,

        duration = "Unknown",

        size = "Unknown",

        source = "YouTube",

        fileName,

        mimetype

    }) {

        return {

            success: true,

            reply: {

                type: "download",

                mediaType,

                url,

                title,

                thumbnail,

                duration,

                size,

                source,

                fileName,

                mimetype

            }

        };

    }

}

export default Reply;
