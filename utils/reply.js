class Reply {

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

    static error(text) {

        return {
            success: false,
            reply: {
                type: "text",
                text: `❌ ${text}`,
                mentions: []
            }
        };

    }

    static success(text) {

        return {
            success: true,
            reply: {
                type: "text",
                text: `✅ ${text}`,
                mentions: []
            }
        };

    }

    static info(text) {

        return {
            success: true,
            reply: {
                type: "text",
                text: `ℹ️ ${text}`,
                mentions: []
            }
        };

    }

    static card({

        title,

        fields = [],

        footer = "🐺 Powered by Kenya-Ultra 👑",

        mentions = []

    }) {

        let text = `╭⊷ ${title}\n│\n`;

        for (const [label, value] of fields) {

            text += `├⊷ ${label}: ${value}\n`;

        }

        text += `│\n`;
        text += `╰⊷ ${footer}`;

        return {

            success: true,

            reply: {
                type: "text",
                text,
                mentions
            }

        };

    }

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

    static video({

        url,

        caption = "",

        mimetype = "video/mp4",

        fileName = "video.mp4"

    }) {

        return {

            success: true,

            reply: {
                type: "video",
                url,
                caption,
                mimetype,
                fileName
            }

        };

    }

    static image({

    url = null,

    file = null,

    caption = "",

    contact = null

}) {

    return {

        success: true,

        reply: {
            type: "image",
            url,
            file,
            caption,
            contact
        }

    };

    }

    static groupIcon({

        caption = "",

        mentions = []

    }) {

        return {

            success: true,

            reply: {
                type: "group_icon",
                caption,
                mentions
            }

        };

    }

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

}

export default Reply;
