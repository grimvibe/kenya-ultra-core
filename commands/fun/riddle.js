import Reply from "../utils/reply.js";

const RIDDLES = [
    { q: "The more you take, the more you leave behind. What am I?", a: "Footsteps" },
    { q: "I speak without a mouth and hear without ears. What am I?", a: "An echo" },
    { q: "What has keys but no locks, space but no room, and you can enter but not go in?", a: "A keyboard" },
    { q: "What gets wetter as it dries?", a: "A towel" },
    { q: "I'm tall when I'm young and short when I'm old. What am I?", a: "A candle" },
    { q: "What has a head and a tail but no body?", a: "A coin" },
    { q: "What can travel around the world while staying in a corner?", a: "A stamp" },
    { q: "What has one eye but can't see?", a: "A needle" },
    { q: "What has many teeth but can't bite?", a: "A comb" },
    { q: "What comes once in a minute, twice in a moment, but never in a thousand years?", a: "The letter M" }
];

export default {

    name: "riddle",

    description: "Get a random riddle with its answer.",

    category: "Fun",

    async execute(ctx) {

        const riddle = RIDDLES[Math.floor(Math.random() * RIDDLES.length)];

        return Reply.text(`🧩 *Riddle*\n\n${riddle.q}\n\n_Answer: ${riddle.a}_`);

    }

};
