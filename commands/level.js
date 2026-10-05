import Reply from "../utils/reply.js";
import {
    getLevelInfo,
    setAnnounceEnabled
} from "../utils/levelSystem.js";
import { renderLevelUpCard } from "../utils/levelCard.js";

export default {

    name: "level",

    aliases: ["rank", "xp"],

    description: "Check your level/XP, or turn off level-up announcements.",

    category: "General",

    usage: ".level  |  .level off  |  .level on",

    async execute(ctx) {

        const sub = (ctx.args[0] || "").toLowerCase();

        if (sub === "off" || sub === "on") {

            if (!ctx.isGroup) {
                return Reply.error("Level announcements only apply inside groups.");
            }

            if (!ctx.isAdmin && !ctx.isBotOwner) {
                return Reply.error("Only group admins can toggle this.");
            }

            await setAnnounceEnabled(
                ctx.sessionId,
                ctx.chat,
                sub === "on"
            );

            return Reply.success(
                sub === "off"
                    ? "Level-up announcements turned off for this group."
                    : "Level-up announcements turned on for this group."
            );

        }

        const groupKey = ctx.isGroup ? ctx.chat : "dm";

        const info = await getLevelInfo(
            ctx.sessionId,
            groupKey,
            ctx.sender
        );

        const buffer = await renderLevelUpCard({
            userId: ctx.sender ? ctx.sender.split("@")[0] : "",
            name: ctx.pushName || "Member",
            level: info.level,
            rank: info.rank,
            totalExp: info.totalExp,
            avatarUrl: ctx.ppUrl || null
        });

        const base64 = `data:image/png;base64,${buffer.toString("base64")}`;

        return Reply.image({
            file: base64,
            caption:
`*${ctx.pushName || "Member"}*
Level: *${info.level}* (${info.rank})
Total EXP: ${info.totalExp}
Next level in: ${info.xpForNext - info.xp} XP`
        });

    }

};
