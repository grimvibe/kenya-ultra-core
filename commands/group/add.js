import Reply from "../../utils/reply.js";

export default {

    name: "add",

    description: "Add a member to the group.",

    category: "Group",

    async execute(ctx) {

        const {
            isGroup,
            isAdmin,
            isBotAdmin,
            args
        } = ctx;

        if (!isGroup)
            return Reply.error(
                "This command can only be used in groups."
            );

        if (!isAdmin)
            return Reply.error(
                "Only group admins can use this command."
            );

        if (!isBotAdmin)
            return Reply.error(
                "I need to be an admin first."
            );

        if (!args[0])
            return Reply.error(
                "Example:\n.add 254712345678"
            );

        let number = args[0].replace(/\D/g, "");

        if (!number.startsWith("254"))
            return Reply.error(
                "Use the international format.\nExample:\n254712345678"
            );

        const target = number + "@s.whatsapp.net";

        return {

            action: "add",

            target,

            reply: Reply.success(
                `Successfully added ${number}.`
            )

        };

    }

};
