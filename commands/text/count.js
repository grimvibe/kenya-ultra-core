import Reply from "../../utils/reply.js";

export default {
    name: "count",
    description: "Count characters, words, and lines in a piece of text.",
    category: "Text Tools",
    usage: ".count <text>",

    async execute(ctx) {
        const text = (ctx.args || []).join(" ");

        if (!text) {
            return Reply.error("Give me some text.\nExample:\n.count hello world");
        }

        const chars = text.length;
        const charsNoSpaces = text.replace(/\s/g, "").length;
        const words = text.trim().split(/\s+/).filter(Boolean).length;
        const lines = text.split("\n").length;

        return Reply.text(
`📊 *Text Stats*

Characters: ${chars} (${charsNoSpaces} without spaces)
Words: ${words}
Lines: ${lines}`
        );
    }
};
