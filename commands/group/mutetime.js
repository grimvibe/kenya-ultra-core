import Reply from "../../utils/reply.js";
import muteService from "../../services/muteService.js";
import getMention from "../../utils/getMention.js";
import parseDuration from "../../utils/parseDuration.js";

export default {

    name: "mutetime",

    description: "Mute a group member for a set duration.",

    category: "Group",

    usage: ".mutetime @user <10m|1h|2d>",

    async execute(ctx) {

        const {
            isGroup,
            isAdmin,
            chat,
            args,
            message
        } = ctx;

        if (!isGroup)
            return Reply.error("This command can only be used in groups.");

        if (!isAdmin)
            return Reply.error("Only group admins can use this command.");

        const target = getMention(message);

        if (!target)
            return Reply.error(
                "Mention a user.\nExample:\n.mutetime @user 10m"
            );

        const durationMs = parseDuration(args[1]);

        if (!durationMs)
            return Reply.error(
                "Provide a valid duration.\nExample:\n.mutetime @user 10m\n\nUnits: s, m, h, d"
            );

        await muteService.mute(chat, target, durationMs);

        return Reply.text(
            `🔇 *Muted*\n\n@${target.split("@")[0]} has been muted for ${args[1]}.`,
            [target]
        );

    }

};
