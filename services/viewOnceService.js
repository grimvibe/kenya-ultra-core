import Reply from "../utils/reply.js";

export async function recoverViewOnce(ctx) {

    const raw = ctx.rawMessage;

console.log("\n========== RAW MESSAGE ==========");
console.dir(raw, { depth: null });
console.log("================================\n");

    if (!message?.extendedTextMessage?.contextInfo?.quotedMessage) {

        return Reply.error(
            "Reply to a View Once photo or video."
        );

    }

    const quoted =
        message.extendedTextMessage.contextInfo.quotedMessage;

    console.log("\n==============================");
    console.log("📦 QUOTED MESSAGE STRUCTURE");
    console.log("==============================");

    console.dir(quoted, { depth: null });

    console.log("==============================\n");

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
        "✅ View Once detected."
    );

}
