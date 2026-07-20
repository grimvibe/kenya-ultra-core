import Reply from "../../utils/reply.js";

export default {

    name: "vv",

    aliases: ["once", "readonce"],

    description: "Recover a View Once photo or video.",

    category: "Media",

    async execute(ctx) {

        const message = ctx.message;

        if (!message?.extendedTextMessage?.contextInfo?.quotedMessage) {

            return Reply.error(
                "Reply to a View Once photo or video."
            );

        }

        const quoted =
            message.extendedTextMessage.contextInfo.quotedMessage;

        const isImage =
            quoted.imageMessage?.viewOnce === true;

        const isVideo =
            quoted.videoMessage?.viewOnce === true;

        if (!isImage && !isVideo) {

            return Reply.error(
                "That message is not a View Once media."
            );

        }

        return {

            success: true,

            action: "recover_view_once",

            mediaType: isImage ? "image" : "video",

            reply: Reply.info(
                "Recovering View Once media..."
            )

        };

    }

};
