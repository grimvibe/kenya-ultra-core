import Reply from "../utils/reply.js";

const OPTIONS = ["rock", "paper", "scissors"];

const EMOJI = {
    rock: "🪨",
    paper: "📄",
    scissors: "✂️"
};

function decideWinner(player, bot) {

    if (player === bot) return "draw";

    const beats = {
        rock: "scissors",
        paper: "rock",
        scissors: "paper"
    };

    return beats[player] === bot ? "player" : "bot";

}

export default {

    name: "rps",

    description: "Play rock-paper-scissors against the bot. Usage: .rps rock",

    category: "Fun",

    async execute(ctx) {

        const choice = (ctx.args || [])[0]?.toLowerCase();

        if (!OPTIONS.includes(choice))
            return Reply.error("Choose one: rock, paper, or scissors.\nExample: .rps rock");

        const botChoice = OPTIONS[Math.floor(Math.random() * OPTIONS.length)];

        const outcome = decideWinner(choice, botChoice);

        let resultLine;

        if (outcome === "draw") resultLine = "🤝 It's a draw!";
        else if (outcome === "player") resultLine = "🎉 You win!";
        else resultLine = "🤖 I win!";

        const text =
`✊✋✌️ *Rock Paper Scissors*

You: ${EMOJI[choice]} ${choice}
Me: ${EMOJI[botChoice]} ${botChoice}

${resultLine}`;

        return Reply.text(text);

    }

};
