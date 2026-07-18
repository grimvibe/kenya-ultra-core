import Reply from "../utils/reply.js";

const ANSWERS = [
    "Yes, definitely.",
    "It is certain.",
    "Without a doubt.",
    "Most likely.",
    "Ask again later.",
    "Cannot predict now.",
    "Better not tell you now.",
    "Don't count on it.",
    "My reply is no.",
    "Outlook not so good.",
    "Very doubtful.",
    "Signs point to yes."
];

export default {

    name: "8ball",

    description: "Ask the magic 8-ball a question. Usage: .8ball Will I pass my exam?",

    category: "Fun",

    async execute(ctx) {

        const question = (ctx.args || []).join(" ").trim();

        if (!question)
            return Reply.error("Ask a question. Example: .8ball Will I pass my exam?");

        const answer = ANSWERS[Math.floor(Math.random() * ANSWERS.length)];

        return Reply.text(`🎱 *Magic 8-Ball*\n\n❓ ${question}\n\n${answer}`);

    }

};
