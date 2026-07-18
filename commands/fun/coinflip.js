import Reply from "../utils/reply.js";

export default {

    name: "coinflip",

    description: "Flip a coin.",

    category: "Fun",

    async execute(ctx) {

        const result = Math.random() < 0.5 ? "Heads" : "Tails";

        return Reply.text(`🪙 *Coin Flip*\n\nIt landed on... *${result}*!`);

    }

};
