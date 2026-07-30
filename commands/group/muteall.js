import Reply from "../../utils/reply.js";
import muteService from "../../services/muteService.js";

export default {

    name: "muteall",

    description: "Mute every member in the group.",

    category: "Group",

    usage: ".muteall",

    async execute(ctx) {

        const {
            isGroup,
            isAdmin,
            isBotAdmin,
            chat,
            groupMetadata
        } = ctx;

        if (!isGroup)
            return Reply.error("This command can only be used in groups.");

        if (!isAdmin)
            return Reply.error("Only group admins can use this command.");

        if (!groupMetadata)
            return Reply.error("Failed to fetch group data.");

        const targets = groupMetadata.participants
            .filter(p => !p.admin)
            .map(p => p.id);

        await muteService.muteMany(chat, targets);

        return Reply.text(
            `🔇 *Group Muted*\n\nAll ${targets.length} members have been muted. Admins can still speak freely.`
        );

    }

};
