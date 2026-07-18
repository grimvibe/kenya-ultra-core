import Reply from "../utils/reply.js";

const LINES = [
    "Are you a parking ticket? Because you've got FINE written all over you.",
    "Do you have a map? I keep getting lost in your eyes.",
    "Is your name Google? Because you have everything I've been searching for.",
    "Are you made of copper and tellurium? Because you're Cu-Te.",
    "If you were a vegetable, you'd be a cute-cumber.",
    "Are you a camera? Because every time I look at you, I smile.",
    "Do you believe in love at first sight, or should I walk by again?",
    "Are you WiFi? Because I'm really feeling a connection.",
    "Is it hot in here, or is it just you?",
    "You must be tired, because you've been running through my mind all day."
];

export default {
    name: "pickupline",
    description: "Get a random (cheesy) pickup line.",
    category: "Fun",

    async execute(message) {

        const line = LINES[Math.floor(Math.random() * LINES.length)];

        return Reply.text(`😏 ${line}`);

    }

};
