class Reply {

    static text(text) {

        return {
            success: true,
            reply: {
                type: "text",
                text
            }
        };

    }

    static image(image, caption = "") {

        return {
            success: true,
            reply: {
                type: "image",
                image,
                caption
            }
        };

    }

    static video(video, caption = "") {

        return {
            success: true,
            reply: {
                type: "video",
                video,
                caption
            }
        };

    }

    static audio(audio) {

        return {
            success: true,
            reply: {
                type: "audio",
                audio
            }
        };

    }

    static document(document, fileName) {

        return {
            success: true,
            reply: {
                type: "document",
                document,
                fileName
            }
        };

    }

    static sticker(sticker) {

        return {
            success: true,
            reply: {
                type: "sticker",
                sticker
            }
        };

    }

    static buttons(text, buttons = []) {

        return {
            success: true,
            reply: {
                type: "buttons",
                text,
                buttons
            }
        };

    }

    static list(title, text, sections = []) {

        return {
            success: true,
            reply: {
                type: "list",
                title,
                text,
                sections
            }
        };

    }

    static error(message) {

        return {
            success: false,
            reply: {
                type: "text",
                text: `❌ ${message}`
            }
        };

    }

}

export default Reply;
