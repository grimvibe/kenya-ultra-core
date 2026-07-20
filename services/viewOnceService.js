import Reply from "../utils/reply.js";

export async function recoverViewOnce(ctx) {

    const raw = ctx.rawMessage;

    console.log("\n========== RAW MESSAGE ==========");
    console.dir(raw, { depth: null });
    console.log("================================\n");

    const message = raw?.message;

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

    return Reply.info("Debug complete.");

}
