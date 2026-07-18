import Reply from "../utils/reply.js";

const QUESTIONS = [
    "What's the most embarrassing thing you've ever done in public?",
    "What's a secret you've never told your best friend?",
    "What's the worst lie you've ever told?",
    "Who was your first crush?",
    "What's something you're scared to admit?",
    "What's the weirdest dream you've ever had?",
    "What's your biggest regret so far?",
    "Have you ever cheated on a test?",
    "What's the pettiest reason you've ever fallen out with someone?",
    "What's a habit you have that you'd never admit to?",
    "What's the last thing you lied about?",
    "Who do you stalk the most on social media?",
    "What's something you pretend to like but actually hate?",
    "What's the most trouble you've ever gotten into?",
    "What's a rumor about you that's actually true?"
];

export default {
    name: "truth",
    description: "Get a random truth question.",
    category: "Fun",

    async execute(message) {

        const question = QUESTIONS[Math.floor(Math.random() * QUESTIONS.length)];

        return Reply.text(`🤫 *Truth*\n\n${question}`);

    }

};
