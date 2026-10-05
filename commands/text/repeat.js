import Reply from "../../utils/reply.js";

const MAX_REPEATS = 20;

export default {
    name: "repeat",
    description: "Repeat text a number of times.",
    category: "Text Tools",
    usage: ".repeat <count> <text>",

    async execute(ctx) {
        const args = ctx.args || [];
        const count = parseInt(args[0], 10);
        const text = args.slice(1).join(" ");

        if (Number.isNaN(count) || count < 1 || !text) {
            return Reply.error("Give me a count and some text.\nExample:\n.repeat 5 hi");
        }
        if (count > MAX_REPEATS) {
            return Reply.error(`Max is ${MAX_REPEATS} repeats — let's not spam the chat 😅`);
        }

        return Reply.text(Array(count).fill(text).join("\n"));
    }
};
