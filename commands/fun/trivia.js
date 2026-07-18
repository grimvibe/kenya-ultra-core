import Reply from "../utils/reply.js";

const TRIVIA = [
    { q: "What is the capital of Kenya?", a: "Nairobi" },
    { q: "Which planet is known as the Red Planet?", a: "Mars" },
    { q: "What is the largest ocean on Earth?", a: "The Pacific Ocean" },
    { q: "Who wrote the play 'Romeo and Juliet'?", a: "William Shakespeare" },
    { q: "What is the smallest prime number?", a: "2" },
    { q: "Which animal is known as the 'King of the Jungle'?", a: "The lion" },
    { q: "How many continents are there on Earth?", a: "7" },
    { q: "What gas do plants primarily absorb from the atmosphere?", a: "Carbon dioxide (CO2)" },
    { q: "Which country hosted the 2022 FIFA World Cup?", a: "Qatar" },
    { q: "What is the tallest mountain in Africa?", a: "Mount Kilimanjaro" }
];

export default {

    name: "trivia",

    description: "Get a random trivia question with its answer.",

    category: "Fun",

    async execute(ctx) {

        const item = TRIVIA[Math.floor(Math.random() * TRIVIA.length)];

        return Reply.text(`🧠 *Trivia*\n\n${item.q}\n\n_Answer: ${item.a}_`);

    }

};
