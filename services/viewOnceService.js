import Reply from "../utils/reply.js";

export async function recoverViewOnce(ctx) {

    const message = ctx.message;

    if (!message?.extendedTextMessage?.contextInfo?.quotedMessage) {

        return Reply.error(
            "Reply to a View Once photo or video."
        );

    }

    const quoted =
        message.extendedTextMessage.contextInfo.quotedMessage;
    console.log("========== QUOTED MESSAGE ==========");
console.dir(quoted, { depth: null });
console.log("====================================");

    const isViewOnce =

        quoted.viewOnceMessage ||

        quoted.viewOnceMessageV2 ||

        quoted.viewOnceMessageV2Extension;

    if (!isViewOnce) {

        return Reply.error(
            "That message is not a View Once media."
        );

    }

    return Reply.info(
        "View Once detected. Recovery engine coming next..."
    );

}
