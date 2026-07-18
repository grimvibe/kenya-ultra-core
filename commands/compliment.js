import Reply from "../utils/reply.js";

const COMPLIMENTS = [
    "is one of the most genuinely kind people around.",
    "has the best energy in any room they walk into.",
    "is way smarter than they give themselves credit for.",
    "always knows how to make people smile.",
    "has impeccable taste and everyone secretly agrees.",
    "is the friend everyone wishes they had.",
    "brings out the best in the people around them.",
    "has a talent for making hard things look easy.",
    "is more talented than they realize.",
    "makes every group chat better just by being in it."
];

export default {
    name: "compliment",
    description: "Give someone a random compliment. Usage: .compliment [@name]",
    category: "Fun",

    async execute(message) {

        const target = (message.args || []).join(" ").trim() || message.pushName || "You";

        const compliment = COMPLIMENTS[Math.floor(Math.random() * COMPLIMENTS.length)];

        return Reply.text(`💐 ${target} ${compliment}`);

    }

};
