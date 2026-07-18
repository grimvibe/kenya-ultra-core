import Reply from "../utils/reply.js";

export default {

    name: "dice",

    description: "Roll dice. Usage: .dice or .dice 2d6",

    category: "Fun",

    async execute(ctx) {

        const input = (ctx.args || [])[0] || "1d6";

        const match = input.match(/^(\d*)d(\d+)$/i);

        if (!match)
            return Reply.error("Invalid format. Example: .dice or .dice 2d6");

        const count = Math.min(parseInt(match[1] || "1", 10), 20);
        const sides = Math.min(parseInt(match[2], 10), 1000);

        if (count < 1 || sides < 2)
            return Reply.error("Invalid dice. Example: .dice 2d6");

        const rolls = [];

        for (let i = 0; i < count; i++) {
            rolls.push(Math.floor(Math.random() * sides) + 1);
        }

        const total = rolls.reduce((a, b) => a + b, 0);

        const text = `🎲 *Dice Roll (${count}d${sides})*\n\n${rolls.join(" + ")} = *${total}*`;

        return Reply.text(text);

    }

};
