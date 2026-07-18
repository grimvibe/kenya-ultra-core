import Reply from "../utils/reply.js";

// Deterministic "compatibility" score — same two names always give
// the same result, based on a simple hash rather than pure random.
function scoreFor(a, b) {

    const combined = [a, b].sort().join("").toLowerCase();

    let hash = 0;

    for (let i = 0; i < combined.length; i++) {
        hash = (hash * 31 + combined.charCodeAt(i)) >>> 0;
    }

    return hash % 101;

}

function barFor(score) {

    const filled = Math.round(score / 10);
    return "█".repeat(filled) + "░".repeat(10 - filled);

}

export default {
    name: "ship",
    description: "Get a compatibility score between two names. Usage: .ship Name1 Name2",
    category: "Fun",

    async execute(message) {

        const args = message.args || [];

        if (args.length < 2) {
            return Reply.error("Provide two names. Example: .ship Alex Sam");
        }

        const nameA = args[0];
        const nameB = args[1];

        const score = scoreFor(nameA, nameB);

        const text = `💘 *Ship Meter*

${nameA} 💞 ${nameB}

[${barFor(score)}] ${score}%`;

        return Reply.text(text);

    }

};
      
