import Reply from "../utils/reply.js";

// Kept deliberately mild/playful — roast-style banter, no slurs or
// anything targeting a person's identity. Meant for consensual fun
// between friends, not actual harassment.
const ROASTS = [
    "your WiFi has more commitment issues than you.",
    "you have the confidence of someone who's never seen the group chat replay.",
    "you're the reason the 'reply all' button has trust issues.",
    "your search history probably needs its own group chat.",
    "you type 'lol' but nobody's ever seen you laugh.",
    "you're proof that autocorrect gives up sometimes.",
    "you argue like you're getting paid per word, badly.",
    "your fashion sense called, it wants a refund.",
    "you're the human version of a buffering icon.",
    "you have main character energy in a side character's story."
];

export default {
    name: "insult",
    description: "Send a playful (friendly) roast. Usage: .insult [@name]",
    category: "Fun",

    async execute(message) {

        const target = (message.args || []).join(" ").trim() || message.pushName || "You";

        const roast = ROASTS[Math.floor(Math.random() * ROASTS.length)];

        return Reply.text(`😂 ${target}, ${roast}`);

    }

};
