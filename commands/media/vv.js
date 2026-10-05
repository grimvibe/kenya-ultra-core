import Reply from "../../utils/reply.js";
import botSettingsService from "../../services/botSettingsService.js";
import isBotOwner from "../../utils/isBotOwner.js";

// Modern WhatsApp wraps View Once media as viewOnceMessageV2 (or the
// older viewOnceMessage / newer viewOnceMessageV2Extension), with the
// actual imageMessage/videoMessage nested one level deeper inside
// `.message`. It is NOT a `viewOnce: true` flag sitting directly on
// imageMessage/videoMessage — checking for that flag alone basically
// never matches real messages from current WhatsApp clients, which
// was the actual bug here.
function unwrapViewOnce(quoted) {

    const wrapped =
        quoted.viewOnceMessageV2Extension?.message ||
        quoted.viewOnceMessageV2?.message ||
        quoted.viewOnceMessage?.message ||
        null;

    if (wrapped) {
        return wrapped;
    }

    // Rare legacy case: some older clients did set the flag directly.
    if (quoted.imageMessage?.viewOnce || quoted.videoMessage?.viewOnce) {
        return quoted;
    }

    return null;

}

// A single visible emoji character, allowing for skin-tone modifiers
// / ZWJ sequences (👍🏽, ❤️, etc) without accidentally matching
// someone pasting a whole sentence.
function isSingleEmoji(str) {
    const stripped = str.trim();
    if (!stripped) return false;
    return [...stripped].length <= 4 && !/[a-zA-Z0-9]/.test(stripped);
}

export default {

    name: "vv",

    aliases: ["once", "readonce"],

    description:
        "Recover a View Once photo or video. Reply to one with .vv, " +
        "or set a reaction-trigger emoji with .vv <emoji> (owner only) " +
        "so reacting with that emoji auto-recovers it instead.",

    category: "Media",

    usage: "Reply to a View Once media with .vv, or .vv 👀 to set a trigger emoji",

    async execute(ctx) {

        const message = ctx.message;

        const quotedRaw =
            message?.extendedTextMessage?.contextInfo?.quotedMessage;

        // No quoted message — treat any argument as a request to set
        // (or clear) the reaction-trigger emoji instead.
        if (!quotedRaw) {

            const arg = (ctx.args || []).join(" ").trim();

            if (!arg) {

                return Reply.error(
                    "Reply to a View Once photo or video with .vv, or set a trigger emoji with .vv <emoji>."
                );

            }

            if (!isBotOwner(ctx.sender, ctx.botIds)) {
                return Reply.error("Only the bot owner can set the trigger emoji.");
            }

            if (arg.toLowerCase() === "off" || arg.toLowerCase() === "reset") {

                await botSettingsService.setViewOnceEmoji(ctx.sessionId, null);
                return Reply.success("Reaction-trigger emoji turned off.");

            }

            if (!isSingleEmoji(arg)) {
                return Reply.error("Please provide a single emoji, e.g. .vv 👀");
            }

            await botSettingsService.setViewOnceEmoji(ctx.sessionId, arg);

            return Reply.success(
                `Trigger emoji set to ${arg}. React with it on a View Once message to recover it automatically — it'll be sent to your DM, not wherever the reaction happened.`
            );

        }

        const unwrapped = unwrapViewOnce(quotedRaw);

        if (!unwrapped) {

            return Reply.error(
                "That message is not a View Once media."
            );

        }

        const isImage = Boolean(unwrapped.imageMessage);
        const isVideo = Boolean(unwrapped.videoMessage);

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
                "Recovering View Once media... it'll be sent to the owner's DM."
            )

        };

    }

};
