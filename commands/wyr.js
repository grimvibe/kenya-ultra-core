import Reply from "../utils/reply.js";

const QUESTIONS = [
    "have the ability to fly, or be invisible?",
    "always be 10 minutes late, or 20 minutes early?",
    "know when you're going to die, or how you're going to die?",
    "give up your phone for a month, or give up junk food for a year?",
    "be able to speak every language, or play every instrument?",
    "live without music, or live without TV/movies?",
    "have unlimited money but no friends, or unlimited friends but no money?",
    "be famous but broke, or unknown but wealthy?",
    "lose all your memories, or never make new ones?",
    "always have to say what's on your mind, or never be able to speak again?",
    "have the power to read minds, or the power to teleport?",
    "live in the past, or live in the future?"
];

export default {
    name: "wyr",
    description: "Get a random 'Would You Rather' question.",
    category: "Fun",

    async execute(message) {

        const question = QUESTIONS[Math.floor(Math.random() * QUESTIONS.length)];

        return Reply.text(`🤔 *Would You Rather*\n\n...${question}`);

    }

};
