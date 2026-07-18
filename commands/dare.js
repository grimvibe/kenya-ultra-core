import Reply from "../utils/reply.js";

const DARES = [
    "Send the last photo in your gallery to this chat.",
    "Text your crush 'I miss you' right now.",
    "Change your profile picture to something embarrassing for 10 minutes.",
    "Speak in an accent for the next 5 messages.",
    "Post an embarrassing childhood story in your status.",
    "Call a random contact and sing them happy birthday.",
    "Send a voice note singing your favorite song.",
    "Let someone in this chat post your next WhatsApp status.",
    "Text your mom 'I need money for pizza' and send a screenshot.",
    "Do 10 push-ups right now and admit you did it.",
    "Reply to your last 5 messages with only emojis.",
    "Send the most recent screenshot in your gallery.",
    "Type your next 3 messages using only your nose.",
    "Tell the group your most used emoji and why."
];

export default {
    name: "dare",
    description: "Get a random dare challenge.",
    category: "Fun",

    async execute(message) {

        const dare = DARES[Math.floor(Math.random() * DARES.length)];

        return Reply.text(`🔥 *Dare*\n\n${dare}`);

    }

};
