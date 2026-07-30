import Reply from "../utils/reply.js";
import menuStyleService from "../services/menuStyleService.js";

const TOTAL_STYLES = 8;

async function applyStyle(ctx, style) {

    await menuStyleService.set(ctx.sessionId, ctx.sender, style);

    return Reply.text(
`✅ *Menu Style Updated*

Your menu style is now: *${style}*

Send .menu to see it in action.`
    );

}

export default {

    name: "menustyle",

    aliases: [
        "menustyle1",
        "menustyle2",
        "menustyle3",
        "menustyle4",
        "menustyle5",
        "menustyle6",
        "menustyle7",
        "menustyle8"
    ],

    description: "Change your menu display style (1-8).",

    category: "General",

    usage: ".menustyle <1-8>",

    async execute(ctx) {

        // Support both ".menustyle 3" and ".menustyleN" being invoked
        // directly (the resolved command name carries the number).
        const fromCommandName = (ctx.commandName || "")
            .match(/^menustyle(\d)$/);

        let style = fromCommandName
            ? parseInt(fromCommandName[1], 10)
            : parseInt(ctx.args[0], 10);

        if (!style || style < 1 || style > TOTAL_STYLES) {

            const current = await menuStyleService.get(ctx.sessionId, ctx.sender);

            return Reply.error(
`Please choose a style between 1 and ${TOTAL_STYLES}.

Example:
.menustyle 3

Your current style: ${current}`
            );

        }

        return applyStyle(ctx, style);

    }

};
