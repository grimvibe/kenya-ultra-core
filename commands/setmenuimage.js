import Reply from "../utils/reply.js";
import botSettingsService from "../services/botSettingsService.js";

export default {

    name: "setmenuimage",

    description: "Set the thumbnail image shown with .menu.",

    category: "Owner",

    usage: ".setmenuimage <direct image URL>  |  .setmenuimage reset",

    async execute(ctx) {

        if (!ctx.isBotOwner) {
            return Reply.error("Only the bot owner can use this command.");
        }

        const input = ctx.args?.[0];

        if (!input) {

            return Reply.error(
`Provide a direct image URL, or "reset" to go back to the default.

Example:
.setmenuimage https://i.ibb.co/xxxxx/my-menu-pic.jpg

Note: this needs a public image URL, not a WhatsApp photo — upload the image somewhere first (e.g. ibb.co) and paste the link.`
            );

        }

        if (input.toLowerCase() === "reset") {

            await botSettingsService.setMenuImage(ctx.sessionId, null);
            return Reply.success("Menu image reset to the default.");

        }

        if (!/^https?:\/\//i.test(input)) {
            return Reply.error("Please provide a valid direct image URL starting with http:// or https://");
        }

        await botSettingsService.setMenuImage(ctx.sessionId, input);

        return Reply.success("Menu image updated! Run .menu to see it.");

    }

};
