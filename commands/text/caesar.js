import Reply from "../../utils/reply.js";

function shiftChar(ch, shift) {
    const code = ch.charCodeAt(0);
    if (code >= 65 && code <= 90) return String.fromCharCode(((code - 65 + shift) % 26 + 26) % 26 + 65);
    if (code >= 97 && code <= 122) return String.fromCharCode(((code - 97 + shift) % 26 + 26) % 26 + 97);
    return ch;
}

export default {
    name: "caesar",
    description: "Caesar cipher a piece of text with a custom shift.",
    category: "Text Tools",
    usage: ".caesar <shift> <text>",

    async execute(ctx) {
        const args = ctx.args || [];
        const shift = parseInt(args[0], 10);
        const text = args.slice(1).join(" ");

        if (Number.isNaN(shift) || !text) {
            return Reply.error("Give me a shift number and some text.\nExample:\n.caesar 3 hello world");
        }

        const result = text.split("").map(ch => shiftChar(ch, shift)).join("");
        return Reply.text(`\`\`\`${result}\`\`\``);
    }
};
