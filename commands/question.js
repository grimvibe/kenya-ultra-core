import Reply from "../utils/reply.js";

const QUESTIONS = [
    "What's a skill you wish you had learned earlier in life?",
    "If you could have dinner with anyone, dead or alive, who would it be?",
    "What's the best advice you've ever received?",
    "What's something you believed as a kid that turned out to be false?",
    "If you could live in any decade, which would you pick and why?",
    "What's a small thing that instantly improves your mood?",
    "What's a book, show, or movie that changed how you think?",
    "If money wasn't a factor, what would you do with your life?",
    "What's something you're proud of that you don't talk about much?",
    "What's your most controversial harmless opinion?"
];

export default {
    name: "question",
    description: "Get a random icebreaker question.",
    category: "Fun",

    async execute(message) {

        const question = QUESTIONS[Math.floor(Math.random() * QUESTIONS.length)];

        return Reply.text(`❓ *Question*\n\n${question}`);

    }

};
