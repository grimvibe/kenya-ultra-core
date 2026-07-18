import Reply from "../utils/reply.js";

export default {
    name: "alive",
    description: "Quick check that the bot is online.",
    category: "General",

    async execute(message) {

        const text = `🟢 *Kenya-Ultra is alive!*

Hey ${message.pushName || "there"} 👋
I'm online and ready for commands.

Type *.menu* to see everything I can do.

💚 Powered by Kenya-Ultra`;

        return Reply.text(text);

    }

};
