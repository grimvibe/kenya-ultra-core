import Reply from "../../utils/reply.js";
import muteService from "../../services/muteService.js";
import parseDuration from "../../utils/parseDuration.js";

export default {

    name: "muteallTime",

    aliases: ["muteAllTime"],

    description: "Mute every member in the group for a set duration.",

    category: "Group",

    usage: ".muteallTime <10m|1h|2d>",

    async execute(ctx) {

        const {
            isGroup,
            isAdmin,
            chat,
            args,
            groupMetadata
        } = ctx;

        if (!isGroup)
            return Reply.error("This command can only be used in groups.");

        if (!isAdmin)
            return Reply.error("Only group admins can use this command.");

        if (!groupMetadata)
            return Reply.error("Failed to fetch group data.");

        const durationMs = parseDuration(args[0]);

        if (!durationMs)
            return Reply.error(
                "Provide a valid duration.\nExample:\n.muteallTime 1h\n\nUnits: s, m, h, d"
            );

        const targets = groupMetadata.participants
            .filter(p => !p.admin)
            .map(p => p.id);

        await muteService.muteMany(chat, targets, durationMs);

        return Reply.text(
            `🔇 *Group Muted*\n\nAll ${targets.length} members have been muted for ${args[0]}. Admins can still speak freely.`
        );

    }

};
