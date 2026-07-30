import Reply from "../../utils/reply.js";

export default {

    name: "kicknum",

    description: "Remove all members whose number starts with a given country code.",

    category: "Group",

    usage: ".kicknum <country code>",

    async execute(ctx) {

        if (!ctx.isGroup)
            return Reply.error("This command can only be used in groups.");

        if (!ctx.isAdmin)
            return Reply.error("Only group admins can use this command.");

        if (!ctx.isBotAdmin)
            return Reply.error("I need to be an admin to do that.");

        if (!ctx.groupMetadata)
            return Reply.error("Failed to fetch group data.");

        const code = (ctx.args[0] || "").replace(/\D/g, "");

        if (!code)
            return Reply.error("Provide a country code.\nExample:\n.kicknum 254");

        const targets = ctx.groupMetadata.participants
            .filter(p => !p.admin && p.id.startsWith(code))
            .map(p => p.id);

        if (!targets.length)
            return Reply.error(`No non-admin members found with country code ${code}.`);

        return {

            action: "kick",

            targets,

            reply: Reply.text(`👢 *Removed ${targets.length} member(s)* with country code ${code}.`)

        };

    }

};
