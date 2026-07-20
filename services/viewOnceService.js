import Reply from "../utils/reply.js";

export async function recoverViewOnce(ctx) {

    const raw = ctx.rawMessage;

    const message = raw?.message;

    if (!message?.extendedTextMessage?.contextInfo?.quotedMessage) {

        return Reply.error(
            "Reply to a View Once photo or video."
        );

    }

    const quoted =
        message.extendedTextMessage.contextInfo.quotedMessage;

    return Reply.text(
        "📦 *Quoted Message Structure*\n\n```" +
        JSON.stringify(quoted, null, 2).slice(0, 3500) +
        "```"
    );

}
