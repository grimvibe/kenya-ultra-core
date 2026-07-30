import Reply from "../../utils/reply.js";
import muteService from "../../services/muteService.js";

function formatRemaining(until) {

    if (!until) return "Permanent";

    const ms = until - Date.now();

    if (ms <= 0) return "Expiring...";

    const minutes = Math.ceil(ms / 60000);

    if (minutes < 60) return `${minutes}m left`;

    const hours = Math.floor(minutes / 60);
    const remMinutes = minutes % 60;

    if (hours < 24) return `${hours}h ${remMinutes}m left`;

    const days = Math.floor(hours / 24);
    const remHours = hours % 24;

    return `${days}d ${remHours}h left`;

}

export default {

    name: "listmute",

    description: "Show all currently muted members.",

    category: "Group",

    usage: ".listmute",

    async execute(ctx) {

        const {
            isGroup,
            isAdmin,
            chat
        } = ctx;

        if (!isGroup)
            return Reply.error("This command can only be used in groups.");

        if (!isAdmin)
            return Reply.error("Only group admins can use this command.");

        const data = await muteService.list(chat);
        const userIds = Object.keys(data);

        if (!userIds.length)
            return Reply.text("🔊 No members are currently muted.");

        const lines = userIds.map((id, i) =>
            `${i + 1}. @${id.split("@")[0]} — ${formatRemaining(data[id].until)}`
        );

        return Reply.text(
            `🔇 *Muted Members* (${userIds.length})\n\n${lines.join("\n")}`,
            userIds
        );

    }

};
