import Reply from "../utils/reply.js";
import botSettingsService from "../services/botSettingsService.js";

export default {

    name: "setowner",

    description: "Set the owner name and number shown in .botinfo/.menu (display only — doesn't change command access).",

    category: "Owner",

    usage: ".setowner <name> | <number>",

    async execute(ctx) {

        if (!ctx.isBotOwner) {
            return Reply.error("Only the bot owner can use this command.");
        }

        if (!ctx.args || !ctx.args.length) {

            return Reply.error(
`Provide a name and/or number, separated by |.

Examples:
.setowner Lucid Tech Solutions | 254712345678
.setowner Lucid Tech Solutions
.setowner | 254712345678`
            );

        }

        const raw = ctx.args.join(" ");
        const [namePart, numberPart] = raw.split("|").map(s => s?.trim());

        const name = namePart || undefined;
        const number = numberPart || undefined;

        if (!name && !number) {
            return Reply.error("Provide at least a name or a number.");
        }

        if (name && name.length > 40) {
            return Reply.error("Keep the owner name under 40 characters.");
        }

        if (number && !/^\+?\d{7,15}$/.test(number.replace(/[\s-]/g, ""))) {
            return Reply.error("That doesn't look like a valid phone number.");
        }

        const settings = await botSettingsService.setOwnerInfo(ctx.sessionId, {
            name,
            number
        });

        return Reply.success(
`Owner info updated.

👤 Name: ${settings.ownerName || "Not set"}
📱 Number: ${settings.ownerNumber || "Not set"}`
        );

    }

};
