import Reply from "../../utils/reply.js";

export default {

    name: "url",

    description: "Reply to an image or video with .url to get a direct link to it.",

    category: "Media",

    usage: "Reply to an image/video with .url",

    async execute(ctx) {

        const { message } = ctx;

        const quoted =
            message?.extendedTextMessage?.contextInfo?.quotedMessage || null;

        if (!quoted?.imageMessage && !quoted?.videoMessage) {
            return Reply.error("Reply to an image or video with .url");
        }

        return {

            success: true,

            action: "get_media_url"

        };

    }

};
