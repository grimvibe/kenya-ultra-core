import Reply from "./reply.js";

export function textTool({ name, description, usageHint, transform }) {
    return {
        name,
        description,
        category: "Text Tools",
        usage: `.${name} ${usageHint || "<text>"}`,

        async execute(ctx) {
            const text = (ctx.args || []).join(" ");

            if (!text) {
                return Reply.error(
                    `Give me some text.\nExample:\n.${name} ${usageHint || "hello world"}`
                );
            }

            try {
                const result = transform(text, ctx);
                return Reply.text(`\`\`\`${result}\`\`\``);
            } catch (error) {
                return Reply.error(`Couldn't process that: ${error.message}`);
            }
        }
    };
}
