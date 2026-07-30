import Reply from "../../utils/reply.js";

export default {

    name: "creategroup",

    description: "Create a new WhatsApp group.",

    category: "Group",

    usage: ".creategroup <group name>",

    async execute(ctx) {

        const subject = (ctx.args || []).join(" ").trim();

        if (!subject)
            return Reply.error("Provide a name for the group.\nExample:\n.creategroup My New Group");

        if (subject.length > 100)
            return Reply.error("Group name must be 100 characters or fewer.");

        return {

            action: "create_group",

            subject,

            sender: ctx.sender

        };

    }

};
