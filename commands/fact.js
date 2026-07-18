import Reply from "../utils/reply.js";

const FACTS = [
    "Honey never spoils — archaeologists have found 3,000-year-old honey in Egyptian tombs that's still edible.",
    "Octopuses have three hearts and blue blood.",
    "A bolt of lightning is roughly five times hotter than the surface of the sun.",
    "Bananas are berries, but strawberries aren't.",
    "The Great Wall of China is not visible from space with the naked eye — that's a myth.",
    "A group of flamingos is called a 'flamboyance'.",
    "Sharks existed before trees — sharks are about 400 million years old, trees about 350 million.",
    "The Eiffel Tower can grow taller in summer due to thermal expansion of the metal.",
    "Wombat poop is cube-shaped.",
    "There are more possible chess games than atoms in the observable universe.",
    "Sea otters hold hands while sleeping so they don't drift apart.",
    "Venus is the only planet that spins clockwise.",
    "The inventor of the frisbee was turned into a frisbee after he died, as per his wishes.",
    "A day on Venus is longer than a year on Venus."
];

export default {
    name: "fact",
    description: "Get a random interesting fact.",
    category: "Fun",

    async execute(message) {

        const fact = FACTS[Math.floor(Math.random() * FACTS.length)];

        return Reply.text(`💡 *Random Fact*\n\n${fact}`);

    }

};
