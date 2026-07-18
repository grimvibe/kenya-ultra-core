import Reply from "../utils/reply.js";

const QUOTES = [
    { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
    { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
    { text: "In the middle of difficulty lies opportunity.", author: "Albert Einstein" },
    { text: "Do not wait for the perfect moment, take the moment and make it perfect.", author: "Unknown" },
    { text: "You miss 100% of the shots you don't take.", author: "Wayne Gretzky" },
    { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
    { text: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb" },
    { text: "Your limitation—it's only your imagination.", author: "Unknown" },
    { text: "Push yourself, because no one else is going to do it for you.", author: "Unknown" },
    { text: "Great things never come from comfort zones.", author: "Unknown" },
    { text: "Dream it. Wish it. Do it.", author: "Unknown" },
    { text: "Little things make big days.", author: "Unknown" }
];

export default {
    name: "quotes",
    description: "Get a random motivational quote.",
    category: "Fun",

    async execute(message) {

        const quote = QUOTES[Math.floor(Math.random() * QUOTES.length)];

        return Reply.text(`✨ *Quote of the Moment*\n\n"${quote.text}"\n\n— ${quote.author}`);

    }

};
