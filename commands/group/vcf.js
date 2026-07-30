import Reply from "../../utils/reply.js";

export default {

    name: "vcf",

    description: "Export all group members as a VCF contacts file.",

    category: "Group",

    usage: ".vcf",

    async execute(ctx) {

        if (!ctx.isGroup)
            return Reply.error("This command can only be used in groups.");

        if (!ctx.isAdmin)
            return Reply.error("Only group admins can use this command.");

        if (!ctx.groupMetadata)
            return Reply.error("Failed to fetch group data.");

        return {

            action: "export_vcf",

            participants: ctx.groupMetadata.participants.map(p => p.id)

        };

    }

};
