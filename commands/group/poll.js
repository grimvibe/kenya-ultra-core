import Reply from "../../utils/reply.js";

export default {

    name: "poll",

    description: "Create a poll. Separate the question and options with |.",

    category: "Group",

    usage: ".poll Question | Option 1 | Option 2 | Option 3",

    async execute(ctx) {

        if (!ctx.isGroup)
            return Reply.error("This command can only be used in groups.");

        if (!ctx.isAdmin)
            return Reply.error("Only group admins can use this command.");

        const raw = (ctx.text || "").split(/\s+/).slice(1).join(" ");

        const parts = raw.split("|").map(p => p.trim()).filter(Boolean);

        if (parts.length < 3)
            return Reply.error(
"Provide a question and at least 2 options, separated by |.\n\nExample:\n.poll Best food? | Pizza | Burgers | Tacos"
            );

        const [question, ...options] = parts;

        if (options.length > 12)
            return Reply.error("Polls support a maximum of 12 options.");

        return {

            action: "send_poll",

            question,

            options,

            selectableCount: 1

        };

    }

};
