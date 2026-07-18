import axios from "axios";
import Reply from "../utils/reply.js";

export default {
    name: "joke",
    description: "Get a random safe-for-work joke.",
    category: "Fun",

    async execute(message) {

        try {

            const { data } = await axios.get(
                "https://v2.jokeapi.dev/joke/Any?safe-mode",
                { timeout: 5000 }
            );

            if (data.error) {
                return Reply.error("Couldn't fetch a joke right now. Try again shortly.");
            }

            const text = data.type === "twopart"
                ? `😄 ${data.setup}\n\n${data.delivery}`
                : `😄 ${data.joke}`;

            return Reply.text(text);

        } catch (error) {

            return Reply.error("Joke service is unreachable right now. Try again shortly.");

        }

    }

};
