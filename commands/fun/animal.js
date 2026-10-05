import axios from "axios";
import Reply from "../../utils/reply.js";

const SOURCES = {

    dog: async () => {
        const { data } = await axios.get(
            "https://dog.ceo/api/breeds/image/random",
            { timeout: 10000 }
        );
        return data.message;
    },

    cat: async () => {
        const { data } = await axios.get(
            "https://api.thecatapi.com/v1/images/search",
            { timeout: 10000 }
        );
        return data[0]?.url;
    },

    fox: async () => {
        const { data } = await axios.get(
            "https://randomfox.ca/floof/",
            { timeout: 10000 }
        );
        return data.image;
    }

};

export default {

    name: "animal",

    aliases: ["dog", "cat", "fox"],

    description: "Get a random dog, cat, or fox picture.",

    category: "Fun",

    usage: ".dog  |  .cat  |  .fox  |  .animal <dog|cat|fox>",

    async execute(message) {

        // If invoked via an alias (.dog/.cat/.fox), use that directly.
        // If invoked as .animal, read the type from args.
        const type =
            ["dog", "cat", "fox"].includes(message.commandName)
                ? message.commandName
                : (message.args?.[0] || "").toLowerCase();

        if (!SOURCES[type]) {

            return Reply.error(
`Please pick one: dog, cat, or fox.

Example:
.animal dog`
            );

        }

        try {

            const url = await SOURCES[type]();

            if (!url) {
                return Reply.error("Couldn't fetch an image right now, try again.");
            }

            return Reply.image({
                url,
                caption: `🐾 Random ${type}!`
            });

        } catch (err) {

            return Reply.error(
                err.message || "Failed to fetch an animal picture."
            );

        }

    }

};
